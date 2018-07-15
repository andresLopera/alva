import * as Message from '../message';
import * as Mobx from 'mobx';
import * as Model from '../model';
import { ViewStore } from '../store';
import * as Types from '../types';
import * as uuid from 'uuid';

export interface NotifierContext {
	app: Model.AlvaApp;
	store: ViewStore;
}

export function createChangeNotifiers({ app, store }: NotifierContext): void {
	const opts = {
		scheduler: window.requestIdleCallback
	};

	Mobx.autorun(() => {
		store.send({
			id: uuid.v4(),
			payload: {
				pages: store.getPages().map(p => p.toJSON())
			},
			type: Message.MessageType.ChangePages
		});
	});

	Mobx.autorun(() => {
		const elements = store.getElements().map(e => e.toJSON());

		store.send({
			id: uuid.v4(),
			payload: { elements },
			type: Message.MessageType.ChangeElements
		});
	});

	Mobx.autorun(() => {
		const elementContents = store.getElementContents().map(e => e.toJSON());

		store.send({
			id: uuid.v4(),
			payload: { elementContents },
			type: Message.MessageType.ChangeElementContents
		});
	});

	Mobx.autorun(() => {
		const elementActions = store.getElementActions().map(e => e.toJSON());

		store.send({
			id: uuid.v4(),
			payload: { elementActions },
			type: Message.MessageType.ChangeElementActions
		});
	});

	Mobx.autorun(() => {
		const metaDown = store.getMetaDown();

		store.send({
			id: uuid.v4(),
			payload: {
				metaDown
			},
			type: Message.MessageType.KeyboardChange
		});
	});

	Mobx.autorun(() => {
		const patternLibraries = store.getPatternLibraries();

		store.send({
			id: uuid.v4(),
			payload: {
				patternLibraries: patternLibraries.map(l => l.toJSON())
			},
			type: Message.MessageType.ChangePatternLibraries
		});

		store.send({
			id: uuid.v4(),
			payload: {
				libraries: patternLibraries
					.filter(l => l.getOrigin() === Types.PatternLibraryOrigin.UserProvided)
					.map(l => l.getId())
			},
			type: Message.MessageType.CheckLibraryRequest
		});
	}, opts);

	Mobx.autorun(() => {
		store.send({
			id: uuid.v4(),
			payload: {
				app: store.getApp().toJSON()
			},
			type: Message.MessageType.ChangeApp
		});
	}, opts);

	// Mobx.autorun(() => {
	// 	const project = store.getProject();
	// 	Sender.send({
	// 		id: uuid.v4(),
	// 		payload: {
	// 			project: project ? project.toJSON() : undefined
	// 		},
	// 		type: Message.MessageType.ChangeProject
	// 	});
	// }, {
	// 	delay: 5000,
	// 	scheduler: window.requestIdleCallback
	// });
}
