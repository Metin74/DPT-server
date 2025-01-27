const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const mongoose = require("mongoose");
const Dialog = require("../models/dialog").dialogModel;
const Opinion = require("../models/opinion").opinionModel;
const Topic = require("../models/topic").topicModel;
const Lo_ = require("lodash");


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createDialog = async (options) => {
	console.log(options);
	if(options.opinionProposition.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Proposition text is to long",
		};
	}
	try {
		const opinion = await Opinion.findOne({"_id": mongoose.Types.ObjectId(options.opinion)});
		options.recipient = opinion.user;
		const result = await Dialog.create(options);
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
	return {
		status: 200,
		data: result,
	};
};


module.exports.getDialog = async (options) => {
	var result;
	try {
		result = await Dialog.findOne({"_id": mongoose.Types.ObjectId(options.body.dialogId)})
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
	
	return( {
		status: 200,
		data: result
	});
}

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to return
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getDialogList = async (options) => {
	var result = [];
	try {
		var worker = {};
		worker = await Dialog.find({"initiator": options.userId}).populate('opinion');
		for(var i = 0; i < worker.length; i++) {
			var collection = {};
			collection.dialog = worker[i].id;
			collection.opinionProposition = worker[i].opinionProposition;
			collection.recipientOpinion = worker[i].opinion.content;
			collection.status = worker[i].status;
			var worker2 = await Topic.findOne({ "_id": mongoose.Types.ObjectId(worker[i].opinion.topic)}).populate('opinions');
			collection.topic = worker2.content;
			var opinion = Lo_.find(worker2.opinions, {user: worker[i].initiator});
			if(opinion) {
				collection.initiatorOpinion = opinion.content;
				collection.initiator = 'me';
				result.push(collection);
			}
		}
	
		worker = await Dialog.find({"recipient": options.userId}).populate('opinion');
		for(var i = 0; i < worker.length; i++) {
			var collection = {};
			collection.dialog = worker[i].id;
			collection.opinionProposition = worker[i].opinionProposition;
			collection.recipientOpinion = worker[i].opinion.content;
			collection.status = worker[i].status;
			var worker2 = await Topic.findOne({ "_id": mongoose.Types.ObjectId(worker[i].opinion.topic)}).populate('opinions');
			collection.topic = worker2.content;
			var opinion = Lo_.find(worker2.opinions, {user: worker[i].initiator});
			if(opinion) {
				collection.initiatorOpinion = opinion.content;
				collection.initiator = 'notme';
				result.push(collection);
			}
		}
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
	
	return {
		status: 200,
		data: result,
	};
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to update
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateDialog = async options => {
	var result;

	try {
		result = await Dialog.findByIdAndUpdate(options.dialogId, options.body);
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}

  return {
    status: 200,
    data: result,
  };
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to update
 * @throws {Error}
 * @return {Promise}
 */
module.exports.postMessage = async options => {

	var dialog;
	
	if(options.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Text entry is to long",
		};
	}

	try {
		dialog = await Dialog.findById(options.dialogId);
		dialog.messages.push(options.body);
		dialog.save();
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}

	return {
		status: 200,
		data: dialog,
	};
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to post crisis to
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createCrisis = async options => {
	var dialog;
	try {
		dialog = await Dialog.findById(options.dialogId);
		dialog.crisises.push(options.body);
		await dialog.save();
	} catch (error) {
		throw {
			status: 500,
			data: error.message,
		};
	}

	return {
		status: 200,
		data: dialog
	};
};
