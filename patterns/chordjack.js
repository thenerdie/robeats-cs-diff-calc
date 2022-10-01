const constants = require("../constants")

module.exports.calculateChordjackDifficulty = cohesions => {
    let strains = []
    
    let lastCohesion
    
    let minAnchor = 4
    let maxAnchor = 25
    let anchorBuff = 1.1

    let consecutiveAnchors = 0
    let consecutiveAnchorsBuff = 1.007

    let ohBuff = 1.07

    for (let cohesion of cohesions) {    
        if (!lastCohesion || cohesion.Type !== "Chord" && lastCohesion.Type !== "Chord") {
            lastCohesion = cohesion
            continue
        }
        
        const difference = cohesion.Time - lastCohesion.Time
        let difficulty = constants.strainToDifficulty(difference)

        const inCommon = constants.findColumnsInCommon(cohesion, lastCohesion)

        if (inCommon.length > 1) {
            if (consecutiveAnchors >= minAnchor)
                difficulty *= Math.pow(anchorBuff, inCommon.length) * Math.pow(consecutiveAnchorsBuff, consecutiveAnchors)

            if (cohesion.HitObjects[0] && cohesion.HitObjects[1] || cohesion.HitObjects[2] && cohesion.HitObjects[3]) {
                difficulty *= ohBuff
            }

            consecutiveAnchors = Math.min(maxAnchor, consecutiveAnchors + 1)
        } else {
            consecutiveAnchors = 0
        }

        // console.log(cohesion.Type, constants.renderCohesion(cohesion))

        strains.push(difficulty)
        
        lastCohesion = cohesion
    }

    let difficulty = 0

    strains.forEach(strain => {
        difficulty += strain
    })

    return difficulty / strains.length
}