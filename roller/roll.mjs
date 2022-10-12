import parser from "./parser.js"

const sum = (source) => source.reduce((t, n) => t + n, 0)

const actualValue = (rolls, meta) => {
    if (meta.mod === "a") {
        return rolls[rolls.length - 1]
    }
    if (meta.mod === "d") {
        return rolls[0]
    }

    return sum(
        rolls.slice(
            -(meta.take ?? rolls.length)
        )
    )
}
const rollem = (count, size) => {
    if (count === null) {
        return [size]
    }

    const rolls = Array.from(
        { length: count },
        () => Math.floor(
            Math.random() * size
        ) + 1
    ).sort((a, b) => a - b)

    return rolls
}

const nullType = Symbol("null")
const rollDie = (info) => {
    const {meta, sign, count, size} = info

    const rolls = rollem(count, size)
    const value = sign * actualValue(rolls, meta ?? {})

    return [info, meta?.type ?? nullType, value, rolls]
}

const metaMods = {
    a: "Advantage",
    d: "Disadvantage",
}
const formatMeta = (meta) => {
    if (meta === null) {
        return ""
    }

    const adMod = meta.mod ? metaMods[meta.mod] : null
    const takeMod = meta.take ? `take ${meta.take}` : null

    const parts = [
        meta.type === nullType ? null : meta.type,
        adMod ?? takeMod ?? null
    ].filter(part => part !== null)

    return `[${parts.join(",")}]`
}
const formatRolls = (info, value, rolls) => {
    if (info.count === null) {
        return ""
    }

    if (rolls.length === 1) {
        return `(${value})`
    }

    return `(${value}: ${rolls.join(", ")})`
}
const summary = ([info, , value, rolls]) => {
    const sign = info.sign === -1 ? "-" : "+"
    const die = info.count ? `${info.count}d` : ""
    const meta = formatMeta(info.meta)
    const rollSummary = formatRolls(info, value, rolls)

    return `${sign}${die}${info.size}${rollSummary}${meta}`
}
const roll = (input) => {
    const dice = parser.parse(input)
    const rolls = dice.map(rollDie)

    const totals = rolls.reduce(
        (t, [, type, value]) => {
            const d = (t[type] ?? 0) + value
            t[type] = d
            return t
        },
        {}
    )

    const totalDMG = sum(
        Object.values(totals)
    ) + (totals[nullType] ?? 0)

    const types = [...new Set(rolls.map(r => r[1]))]
    const totalTypedDMG = types.map(
        (type) => {
            const typeName = (type === nullType) ? "" : `[${type}]`
            return `${totals[type]}${typeName}`
        }
    ).join(" + ")

    const rollResults = rolls.map(summary).join(" ")

    return `${totalDMG}(${totalTypedDMG})\nfrom: ${rollResults}`
}

export default roll
