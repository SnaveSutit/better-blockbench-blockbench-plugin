import { PACKAGE } from '..'
import { BlockbenchMod } from '../mods'

const oldMethod = Keyframe.prototype.compileBedrockKeyframe
function newMethod() {
	// @ts-ignore
	const thisKeyframe: Keyframe = this
	if (thisKeyframe.transform) {
		if (thisKeyframe.interpolation != 'linear' && thisKeyframe.interpolation != 'step') {
			return {
				// This is the only part of the method that is changed from the original
				// Vanilla Blockbench ignores the pre value
				pre: thisKeyframe.getArray(0),
				post: thisKeyframe.getArray(1),
				lerp_mode: thisKeyframe.interpolation,
			}
			// @ts-ignore
		} else if (thisKeyframe.data_points.length == 1) {
			// @ts-ignore
			let previous = thisKeyframe.getPreviousKeyframe()
			if (previous && previous.interpolation == 'step') {
				return new oneLiner({
					pre: previous.getArray(1),
					post: thisKeyframe.getArray(),
				})
			} else {
				return thisKeyframe.getArray()
			}
		} else {
			return new oneLiner({
				pre: thisKeyframe.getArray(0),
				post: thisKeyframe.getArray(1),
			})
		}
	} else if (thisKeyframe.channel == 'timeline') {
		let scripts: string[] = []
		// @ts-ignore
		thisKeyframe.data_points.forEach((data_point: any) => {
			if (data_point.script) {
				scripts.push(...data_point.script.split('\n'))
			}
		})
		scripts = scripts.filter(script => !!script.replace(/[\n\s;.]+/g, ''))
		return scripts.length <= 1 ? scripts[0] : scripts
	} else {
		let points: any[] = []
		// @ts-ignore
		thisKeyframe.data_points.forEach((data_point: any) => {
			if (data_point.effect) {
				let script = data_point.script || undefined
				if (script && !script.replace(/[\n\s;.]+/g, '')) script = undefined
				if (script && !script.match(/;$/)) script += ';'
				points.push({
					effect: data_point.effect,
					locator: data_point.locator || undefined,
					pre_effect_script: script,
				})
			}
		})
		return points.length <= 1 ? points[0] : points
	}
}

const mod = new BlockbenchMod({
	name: `${PACKAGE.name}:preKeyframeFix -> OverwriteMethod: Keyframe.prototype.compileBedrockKeyframe`,
	inject() {
		Keyframe.prototype.compileBedrockKeyframe = newMethod
	},
	extract() {
		Keyframe.prototype.compileBedrockKeyframe = oldMethod
	},
})
