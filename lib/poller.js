/*=============================
Session Polling Helper
-------------------------------
Tianhai InfoTech
	http://tianhai.info/
Soha Jin
	https://sohaj.in/
=============================*/

'use strict';

class Poller{
	constructor(dbModel,conf){
		if(!dbModel){
			throw new Error('You must define a database model.');
		}
		this.data=dbModel;
		this.config={
			lifetime: 30*60*1000,
			escapeString: "exit",
			escapeReply: "You've cancelled the operation."
		};
		if(conf.constructor===Object){
			for(var key in this.config){
				if(this.config.hasOwnProperty(key)){
					if(conf.hasOwnProperty(key)){
						this.config[key]=conf[key];
					}
				}
			}
		}
		this.flow={};
	}

	load(aDrop){
		if(aDrop.constructor===Array){
			for(var i in aDrop){
				if(aDrop.hasOwnProperty(i)){
					let now=aDrop[i];
					this.flow[now.entry]=now.flow;
				}
			}
		}else{
			let now=aDrop;
			this.flow[now.entry]=now.flow;
		}
	}

	async inFlow(uniqueId){
		if(uniqueId){
			return await this.data.getSession(uniqueId);
		}else{
			throw new Error('Parameter missing');
		}
	}

	async handler({
		uniqueId,
		content,
		flowParameter
	}){
		if(uniqueId && content){
			content=content.trim();
			let session=await this.data.getSession(uniqueId);

			if(!session){
				if(this.flow.hasOwnProperty(content)){
					session=new this.data();
					session.newSession({
						unique: uniqueId,
						entry: content
					});
				}else{
					return false;
				}
			}

			if(content==this.config.escapeString){
				session.setExited();
				return this.config.escapeReply;
			}

			session.addToConversation({
				sender: 'there',
				content: content
			});
			session.currentLayerInc();
			if(session.get('currentLayer')==this.flow[session.get('entry')].length){
				session.setFinished();
			}

			return this.flow[session.get('entry')][session.get('currentLayer')-1](session);
		}else{
			throw new Error('Parameter missing');
		}
	}
}

module.exports=Helper;
