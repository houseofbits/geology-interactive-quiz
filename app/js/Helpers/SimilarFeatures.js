const similarFeatureIds = {
    1: [1, 2, 6],
    2: [2, 1, 6],
    3: [3, 4, 7, 8],
    4: [4, 3, 7, 8],
    5: [5],
    6: [6, 2, 1],
    7: [7, 8, 4, 3],
    8: [8, 7, 4, 3],
};

export function hasSimilarFeatures(featureId) {
    return similarFeatureIds[featureId].length > 1;
}

export function getSimilarFeatureIds(featureId) {
    return similarFeatureIds[featureId];
}