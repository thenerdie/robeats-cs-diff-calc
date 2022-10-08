const constants = require("../constants")

module.exports.calculateJumpstreamDifficulty = cohesions => {
    let npsBase = constants.getNPS(cohesions)

    let minMultiplier = 0.75
    let maxMultiplier = 1

    const fingerCount = constants.getFingerCount(cohesions)

    console.log(fingerCount)

    let lastCohesion

    let jackRatio = cohesions.filter(cohesion => ["Quad", "Chord", "Jump"].find(c => c == cohesion.Type)).length / cohesions.length
    let quadRatio = cohesions.filter(cohesion => cohesion.Type == "Quad").length / cohesions.length

    if (quadRatio >= 0.85 || jackRatio < 0.3) {
        return npsBase * minMultiplier
    }
    
    const anchorCount = [ 0, 0, 0, 0 ]

    for (let cohesion of cohesions) {    
        if (!lastCohesion || cohesion.Type !== "Chord" && lastCohesion.Type !== "Chord") {
            lastCohesion = cohesion
            continue
        }

        inCommon = constants.findColumnsInCommon(cohesion, lastCohesion)
        lastCohesion = cohesion
    }

    return npsBase
}