Dice
	= DieRoll*

DieRoll
	= sign:Sign count:DieCount? size:Number meta:Meta? {
    	return { sign, count, size, meta }
    }
Meta
	= "[" type:($[a-zA-Z]+)? mod:(":" ("a" / "d"))? take:("*" Number)? "]" {
    	return {
        	type,
            mod: mod?.[1] ?? null,
            take: take?.[1] ?? null,
        }
    }

DieCount
	= count:Number "d" { return parseInt(count) }
Sign
	= sign:(_ ("-" / "+") _)? { return parseInt(`${sign?.[1] ?? "+"}1`) }

Number
	= num:$([0-9]+) { return parseInt(num) }
_ = [ \t]*
__ = [ \t]+
