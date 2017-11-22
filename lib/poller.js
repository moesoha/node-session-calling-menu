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

	inFlow(uniqueId){
		if(uniqueId){
			return await this.data.getSession(uniqueId);
		}else{
			throw new Error('Parameter missing');
		}
	}

	handler({
		content
	}){
		
	}
}

module.exports=Helper;