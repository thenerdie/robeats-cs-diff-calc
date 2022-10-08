const constants = require("../constants")

module.exports.calculateChordjackDifficulty = cohesions => {
    let npsBase = constants.getNPS(cohesions)

    let bonusCount = 0

    let minMultiplier = 0.75
    let maxMultiplier = 1.08

    const fingerCount = constants.getFingerCount(cohesions)

    let lastCohesion

    let jackRatio = cohesions.filter(cohesion => ["Quad", "Chord", "Jump"].find(c => c == cohesion.Type)).length / cohesions.length
    let quadRatio = cohesions.filter(cohesion => cohesion.Type == "Quad").length / cohesions.length

    if (quadRatio >= 0.8 || jackRatio < 0.3) {
        return npsBase * minMultiplier
    }

    for (let cohesion of cohesions) {    
        if (!lastCohesion || cohesion.Type !== "Chord" && lastCohesion.Type !== "Chord") {
            lastCohesion = cohesion
            continue
        }

        let inCommon = constants.findColumnsInCommon(cohesion, lastCohesion)

        // console.log(`${constants.renderCohesion(cohesion)}\n${constants.renderCohesion(lastCohesion)}, ${inCommon}\n`)

        // detects double-hand-anchored patterns (ahem far in the blue sky)

        // o o
        // ooo
        // o oo
        // oo o

        // see the anchor on columns 1 and 3?

        if (inCommon.length >= 2 && (inCommon.includes(1) || inCommon.includes(2)) && (inCommon.includes(3) || inCommon.includes(4))) {
            bonusCount += 1
        }

        lastCohesion = cohesion
    }

    let multiplier = (bonusCount / cohesions.length) + 1

    const finalMultiplier = Math.max(Math.min(maxMultiplier, multiplier), minMultiplier)
    // const finalMultiplier = 1

    // console.log(finalMultiplier)

    return npsBase * finalMultiplier
}