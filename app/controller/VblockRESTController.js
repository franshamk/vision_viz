/*
 * File: app/controller/VblockRESTController.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.controller.VblockRESTController', {
    extend: 'Ext.app.Controller',

    config: {
        visionURL: 'https://fm-sim-nimsoft.internal.superna.net:8443',
        visionUser: 'admin',
        visionPass: 'dangerous'
    },

    getBaseResource: function(url, ticket) {
        var me = this;

        url = this.config.visionURL + url;

        if(ticket) {
            url = url +"?ticket=" + ticket;
        }



        Ext.Ajax.request({
            method: 'GET',
            url: url,
            useDefaultXhrHeader: false,
            success: function(data) {  

                var parser=new DOMParser();
                var	xmlDoc=parser.parseFromString(data.responseText,"text/xml");

                var vbs = me.xmlToJson(xmlDoc);


                for(var i in vbs.vblocks) {

                    if(i != 'vblock') {
                        continue;
                    }

                    var vb = vbs.vblocks[i];

                    // these should be the individual vblocks
                    console.log(vb);
                    var comp = Ext.create('MyApp.model.TreeModel', {
                        text:'compute',
                        link: vb.compute.url['#text']
                    });

                    var network = Ext.create('MyApp.model.TreeModel', {
                        text:'network',
                        link: vb.network.url['#text']
                    });   

                    var storage = Ext.create('MyApp.model.TreeModel', {
                        text:'storage',
                        link: vb.storage.url['#text']
                    });    

                    var conn = Ext.create('MyApp.model.TreeModel', {
                        text:'connectivity',
                        link: vb.connectivity.url['#text']
                    });     

                    var rack = Ext.create('MyApp.model.TreeModel', {
                        text:'rack',
                        link: vb.rack.url['#text']
                    });          

                    var vb = Ext.create('MyApp.model.TreeModel', {
                        text:'vblock ' + vb.serialNum['#text'],
                        children: [comp, network, storage, conn, rack]
                    });

                    Ext.getStore('VblockTreeStore').getRoot().appendChild(vb);

                } 

            }
        });



    },

    getResource: function(url, ticket) {

        alert("getting respource");
        url = this.config.visionURL + url;

        var me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: url,
            useDefaultXhrHeader: false,
            success: function(data) {        
                alert(data.responseText); 
            }
        });

    },

    doLogin: function() {
        var me = this;

        var cas = me.config.visionURL + "/cas/v1/tickets";
        var base = "/fm/vblocks";


        alert('doing login');

        Ext.Ajax.request({
            method: 'POST',
            url: cas,
            params: {
                username: me.config.visionUser,
                password: me.config.visionPass
            },
            useDefaultXhrHeader: false,
            success: function(data) {   

                alert('got ticketGrantingTicket');
                var el = document.createElement('div');
                el.innerHTML = data.responseText;        
                var list = el.getElementsByTagName('form');
                me.ticketGrantingTicket = list[0].action;

                // NExt, get a service ticket. 
                Ext.Ajax.request({
                    method: 'POST',
                    url: me.ticketGrantingTicket,
                    params: {
                        service: me.config.visionURL + base
                    },
                    useDefaultXhrHeader: false,
                    success: function(data) {        
                        alert(data.responseText); 
                        // fetch the resource on success. 
                        me.getBaseResource(base, data.responseText);
                    }
                });
            }
        });
    },

    init: function(application) {
        this.doLogin();
    },

    xmlToJson: function(xml) {
        var me = this;

        //Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = me.xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(me.xmlToJson(item));
                }
            }
        }
        return obj;
    },

    onDynListItemTap: function(nestedlist, list, index, target, record, e, eOpts) {
        var me = this;

        var onSuccess =  function(data) {
            var children = me.processDoc(data.responseText);  

            if(!children || children.length == 0) {
                return;
            }

            children.forEach(function(child) {
                record.appendChild(child);
            });
            updateViews();
        };

        var updateViews = function () {
            alert('updating views');
            history.pushState();
            me.getApplication().getController('NavSheetController').doSelectionChange(record.id);    
            nestedlist.fireEvent('levelloaded', this, list, index, target, record, e);
        };   


        if(record.hasChildNodes()) {
            updateViews();
            return;
        } 

        alert(record.get('link'));

        // need to add loadmask here
        Ext.Ajax.request({
            method: 'GET',
            url: record.get('link'),
            useDefaultXhrHeader: false,
            success: onSuccess
        });
    },

    processDoc: function(xml) {
        var parser=new DOMParser();
        var	xmlDoc=parser.parseFromString(xml,"text/xml");

        var topcontainer = this.xmlToJson(xmlDoc);  // computesystems
        console.log(topcontainer);

        var models = []

        for(var i in topcontainer) {
            var elements = topcontainer[i];

            for(var j in elements) { // computesystem[]   

                var element = elements[j]; // computesystem  THIS IS THE MODEL. 

                // append the links as children to this model. 

                if(!element.link) {
                    console.log("no links in element");
                    console.log(element);
                    continue;
                }

                for (var child in element.link) {
                    var url = element.link[child]['@attributes'].href;
                    var name = url.split('/').pop();

                    var model = Ext.create('MyApp.model.TreeModel', {
                        text: name,
                        link: url
                    });
                    models.push(model);
                }
            }

        }

        return models;
    }

});