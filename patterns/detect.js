const constants = require("../constants")

module.exports.detectPatterns = cohesions => {
    const jumps = cohesions.filter(cohesion => cohesion.Type == "Jump").length
    const chords = cohesions.filter(cohesion => cohesion.Type == "Chord").length
    const quads = cohesions.filter(cohesion => cohesion.Type == "Quad").length

    let jacks = 0
    let streams = 0

    cohesions.forEach((cohesion, i) => {
        if (i == 0)
            return
        
        const prevCohesion = cohesions[i - 1]

        if (constants.findColumnsInCommon(cohesion, prevCohesion).length > 0) {
            jacks++
        } else {
            streams++
        }
    });

    const scaledTotal = cohesions.length - 1

    const skillsets = [
        { type: "jack", value: jacks / scaledTotal },
        { type: "chordjacks", value: (chords + quads * 0.85 + jumps * 0.5) / scaledTotal },
        { type: "jumpstream", value: (jumps / streams) * 2 },
        { type: "handstream", value: (chords / streams - 0.5) * 2 },
        { type: "stream", value: (streams - jumps - chords - quads) / scaledTotal },
    ]

    return skillsets
}