import * as PACKAGE from '../package.json'
import * as events from './events'
import './mods'
import './mods/preKeyframeFix'
export {PACKAGE}

BBPlugin.register(PACKAGE.name, {
	title: PACKAGE.title,
	author: PACKAGE.author.name,
	description: PACKAGE.description,
	icon: 'personal_injury',
	variant: 'both',
	// @ts-ignore // Blockbench types are outdated >:I
	version: PACKAGE.version,
	min_version: PACKAGE.min_blockbench_version,
	tags: ['Blockbench', 'is outdated', 'and broken'],
	onload() {
		devlog(`${PACKAGE.name} loaded!`)
		events.load.trigger()
	},
	onunload() {
		devlog(`${PACKAGE.name} unloaded!`)
		events.unload.trigger()
	},
	oninstall() {
		devlog(`${PACKAGE.name} installed!`)
		events.install.trigger()
	},
	onuninstall() {
		devlog(`${PACKAGE.name} uninstalled!`)
		events.uninstall.trigger()
	},
})
