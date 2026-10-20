<?php
declare(strict_types=1);

function perfectBuyNormaliseLockerSearch(string $value): string {
    $value = strtr($value, ['é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','É'=>'e','È'=>'e','Ê'=>'e','Ë'=>'e',
        'á'=>'a','à'=>'a','â'=>'a','ä'=>'a','Á'=>'a','À'=>'a','Â'=>'a','Ä'=>'a',
        'í'=>'i','ì'=>'i','î'=>'i','ï'=>'i','Í'=>'i','Ì'=>'i','Î'=>'i','Ï'=>'i',
        'ó'=>'o','ò'=>'o','ô'=>'o','ö'=>'o','Ó'=>'o','Ò'=>'o','Ô'=>'o','Ö'=>'o',
        'ú'=>'u','ù'=>'u','û'=>'u','ü'=>'u','Ú'=>'u','Ù'=>'u','Û'=>'u','Ü'=>'u','ç'=>'c','Ç'=>'c','ñ'=>'n','Ñ'=>'n']);
    $value = trim(preg_replace('/[^a-z0-9]+/', ' ', strtolower($value)));
    return preg_replace(['/\btree rivers\b/','/\brd\b/','/\bst\b/','/\bdr\b/','/\bave\b/','/\bblvd\b/','/\bln\b/','/\bgen\b/'],
        ['three rivers','road','street','drive','avenue','boulevard','lane','general'], $value);
}

function perfectBuyLockerSearchWords(string $value): array {
    $roadWords = ['road','street','drive','avenue','boulevard','lane','corner','cnr','c','o'];
    return array_values(array_unique(array_filter(explode(' ', perfectBuyNormaliseLockerSearch($value)),
        fn($word) => strlen($word) >= 2 && !in_array($word, $roadWords, true))));
}

function perfectBuyLockerWordMatches(string $queryWord, string $word): bool {
    return $word === $queryWord || (strlen($queryWord) >= 4 && str_starts_with($word, $queryWord));
}

// Input must be the verified, online, visible Large-compatible locker list from courier.php.
function perfectBuySearchCollectionLockers(array $lockers, string $query): array {
    $queryWords = perfectBuyLockerSearchWords($query);
    if (!$queryWords) return ['lockers'=>[], 'matchType'=>'none'];
    $ranked = [];
    foreach ($lockers as $locker) {
        $words = perfectBuyLockerSearchWords($locker['name'].' '.$locker['address'].' '.$locker['city']);
        $nameWords = perfectBuyLockerSearchWords($locker['name']);
        $exact = true; $score = 0;
        foreach ($queryWords as $queryWord) {
            $matched = (bool)array_filter($words, fn($word) => perfectBuyLockerWordMatches($queryWord, $word));
            if (!$matched) $exact = false;
            $score += in_array($queryWord, $words, true) ? 3 : ($matched ? 1 : 0);
            if (array_filter($nameWords, fn($word) => perfectBuyLockerWordMatches($queryWord, $word))) $score += 2;
        }
        $ranked[] = ['locker'=>$locker, 'exact'=>$exact, 'score'=>$score];
    }
    $compare = fn($a, $b) => ($b['score'] <=> $a['score']) ?: strcmp(perfectBuyNormaliseLockerSearch($a['locker']['name']), perfectBuyNormaliseLockerSearch($b['locker']['name']));
    $exact = array_values(array_filter($ranked, fn($entry) => $entry['exact']));
    usort($exact, $compare);
    if ($exact) return ['lockers'=>array_column(array_slice($exact, 0, 40), 'locker'), 'matchType'=>'exact'];

    $broadAreas = ['south africa','gauteng','western cape','eastern cape','northern cape','free state','kwazulu natal','limpopo','mpumalanga','north west','northwest','south africa za'];
    $genericAreaWords = ['north','south','east','west','central','park','city','town','new','old','extension','ext','estate','estates','africa','province'];
    $areas = [];
    foreach ($lockers as $locker) {
        $candidates = [['label'=>$locker['city'], 'city'=>true]];
        foreach (array_slice(explode(',', $locker['address']), 1) as $label) $candidates[] = ['label'=>trim($label), 'city'=>false];
        foreach ($candidates as $candidate) {
            $key = perfectBuyNormaliseLockerSearch($candidate['label']);
            $words = perfectBuyLockerSearchWords($candidate['label']);
            if (!$key || in_array($key, $broadAreas, true) || !array_filter($words, fn($word) => preg_match('/[a-z]/', $word) && !in_array($word, $genericAreaWords, true))) continue;
            $matched = true;
            foreach ($words as $word) {
                if (!array_filter($queryWords, fn($queryWord) => perfectBuyLockerWordMatches($queryWord, $word))) { $matched = false; break; }
            }
            if (!$matched) continue;
            if (!isset($areas[$key]) || $candidate['city']) $areas[$key] = ['label'=>trim($candidate['label']), 'words'=>$words, 'city'=>$candidate['city']];
        }
    }
    $areas = array_values($areas);
    usort($areas, fn($a, $b) => (count($b['words']) <=> count($a['words'])) ?: (($b['city'] <=> $a['city']) ?: strcmp($a['label'], $b['label'])));
    if (!$areas) return ['lockers'=>[], 'matchType'=>'none'];
    $area = $areas[0];
    $matches = array_values(array_filter($ranked, function ($entry) use ($area) {
        $words = perfectBuyLockerSearchWords($entry['locker']['city'].' '.$entry['locker']['address']);
        foreach ($area['words'] as $word) if (!in_array($word, $words, true)) return false;
        return true;
    }));
    usort($matches, $compare);
    return ['lockers'=>array_column(array_slice($matches, 0, 40), 'locker'), 'matchType'=>'area', 'matchedArea'=>$area['label']];
}
