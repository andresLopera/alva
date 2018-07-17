import * as Electron from 'electron';
import * as Model from '../../model';
import { requestProject } from '../request-project';
import { Sender } from '../../sender/server';
import * as Types from '../../types';
import * as uuid from 'uuid';

export interface FileMenuInjection {
	sender: Sender;
}

export function createFileMenu(
	ctx: Types.MainMenuContext,
	injection: FileMenuInjection
): Electron.MenuItemConstructorOptions {
	const project = ctx.project ? Model.Project.from(ctx.project) : undefined;
	const activePage = project && project.getPages().find(p => p.getActive());

	return {
		label: '&File',
		submenu: [
			{
				label: '&New',
				accelerator: 'CmdOrCtrl+N',
				click: () => {
					injection.sender.send({
						type: Types.MessageType.CreateNewFileRequest,
						id: uuid.v4(),
						payload: undefined
					});
				}
			},
			{
				label: '&Open',
				accelerator: 'CmdOrCtrl+O',
				click: () => {
					injection.sender.send({
						type: Types.MessageType.OpenFileRequest,
						id: uuid.v4(),
						payload: undefined
					});
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'New &Page',
				enabled: typeof ctx.project !== 'undefined',
				accelerator: 'CmdOrCtrl+Shift+N',
				click: () => {
					injection.sender.send({
						type: Types.MessageType.CreateNewPage,
						id: uuid.v4(),
						payload: undefined
					});
				}
			},
			{
				type: 'separator'
			},
			{
				label: '&Save',
				enabled: typeof ctx.project !== 'undefined',
				accelerator: 'CmdOrCtrl+S',
				role: 'save',
				click: async () => {
					const freshProject = await requestProject(injection.sender);

					injection.sender.send({
						type: Types.MessageType.Save,
						id: uuid.v4(),
						payload: {
							path: freshProject.getPath(),
							project: freshProject.toJSON()
						}
					});
				}
			},
			{
				type: 'separator'
			},
			{
				label: '&Export',
				submenu: [
					{
						label: 'Export Page as Sketch',
						enabled: Boolean(activePage),
						click: async () => {
							if (!activePage) {
								return;
							}

							injection.sender.send({
								id: uuid.v4(),
								type: Types.MessageType.ExportSketchPage,
								payload: { path: undefined }
							});
						}
					},
					{
						label: 'Export Page as PNG',
						enabled: Boolean(activePage),
						click: async () => {
							if (!activePage) {
								return;
							}

							injection.sender.send({
								id: uuid.v4(),
								type: Types.MessageType.ExportPngPage,
								payload: { path: undefined }
							});
						}
					},
					{
						type: 'separator'
					},
					{
						label: 'Export Project as HTML',
						enabled: Boolean(activePage),
						accelerator: 'CmdOrCtrl+Shift+E',
						click: async () => {
							if (!project) {
								return;
							}

							injection.sender.send({
								id: uuid.v4(),
								type: Types.MessageType.ExportHtmlProject,
								payload: { path: undefined }
							});
						}
					}
				]
			},
			{
				type: 'separator',
				visible: process.platform !== 'darwin'
			},
			{
				type: 'separator',
				visible: process.platform !== 'darwin'
			},
			{
				label: '&Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			}
		]
	};
}
