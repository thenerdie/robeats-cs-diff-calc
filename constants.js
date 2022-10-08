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

module.exports.getNPS = cohesions => {
    let nps = 0

    for (let cohesion of cohesions) {
        nps += cohesion.HitObjects.filter(hitObject => hitObject == true).length
    }

    return nps
}

module.exports.avg = values => {
    let fin = 0
    values.forEach(value => fin += value)

    return fin / values.length
}

module.exports.sortedAvg = values => {
    return this.avg(values.sort((a, b) => b - a).slice(0, 35))
}

module.exports.getFingerCount = cohesions => {
    let count = [ 0, 0, 0, 0 ]

    cohesions.forEach(cohesion => {
        cohesion.HitObjects.forEach((hitObject, i) => {
            if (hitObject) {
                count[i]++
            }
        })
    })

    return count
}

module.exports.renderCohesion = cohesion => {
    let render = ""

    cohesion.HitObjects.forEach(hitObject => {
        render += hitObject ? "O" : " "
    });

    return render
}

module.exports.getBPMOfCohesions = cohesions => {
    let differences = []

    cohesions.forEach((cohesion, i) => {
        if (i != 0) {
            const prevCohesion = cohesions[i - 1]

            const difference = cohesion.Time - prevCohesion.Time

            differences.push(60000 / (difference * 4))
        }
    })

    return this.avg(differences)
}