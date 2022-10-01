const cohesionTypes = [ "Single", "Jump", "Chord", "Quad" ]

module.exports.findColumnsInCommon = (cohesion1, cohesion2) => {
    let inCommon = []

    for (let column of [0, 1, 2, 3]) {
        if (cohesion1.HitObjects[column] && cohesion2.HitObjects[column]) {
            inCommon.push(column)
        }
    }

    return inCommon
}

module.exports.strainToDifficulty = x => {
    return Math.max(102.2298 - 0.2960015 * x + 0.0003643193 * Math.pow(x, 2) - 1.685578e-7 * Math.pow(x, 4), 0) / 1.4
}

module.exports.getCohesionType = cohesion => {
    let count = 0

    for (let track of cohesion.HitObjects) {
        if (track) {
            count++
        }
    }

    if (count === 0)
        return null

    return cohesionTypes[count - 1]
}

module.exports.renderCohesion = cohesion => {
    let render = ""

    cohesion.HitObjects.forEach(hitObject => {
        render += hitObject ? "*" : "-"
    });

    return render
}