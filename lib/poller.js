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
		this.db=dbModel;
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
		this.flow=[];
	}
}

module.exports=Helper;
