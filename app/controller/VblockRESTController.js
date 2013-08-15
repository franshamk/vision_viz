/*
 * File: app/controller/VblockRESTController.js
 *
 * This file was generated by Sencha Architect version 3.0.0.
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
        visionURL: 'https://vb701-viofm.vce.superna.net:8443',
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
                        link: vb.compute.link['@attributes'].href
                    });
        
                    var network = Ext.create('MyApp.model.TreeModel', {
                        text:'network',
                        link: vb.network.link['@attributes'].href
                    });
        
                    var storage = Ext.create('MyApp.model.TreeModel', {
                        text:'storage',
                        link: vb.storage.link['@attributes'].href
                    });
        
                    var conn = Ext.create('MyApp.model.TreeModel', {
                        text:'connectivity',
                        link: vb.connectivity.link['@attributes'].href
                    });
        
                    var rack = Ext.create('MyApp.model.TreeModel', {
                        text:'rack',
                        link: vb.rack.link['@attributes'].href
                    });
        
                    var vb = Ext.create('MyApp.model.TreeModel', {
                        text:'vblock ' + vb.serialNum['#text'],
                        //type: 'Vblock',
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
        
            me.retrievingData = false;
            var children = me.processDoc(data.responseText);
        
            if(!children || children.length === 0) {
                me.setLoading(false);
                return;
            }
        
            record.set('leaf', false);
        
            children.forEach(function(child) {
                record.appendChild(child);
            });
        
            updateViews(true);
            me.setLoading(false);
        };
        
        var updateViews = function (added) {
            history.pushState();
            me.getApplication().getController('NavSheetController').doSelectionChange(record.id, record, added);
            nestedlist.fireEvent('levelloaded', this, list, index, target, record, e);
        };
        
        
        if(record.hasChildNodes()) {
            updateViews(false);
            return;
        }
        
        // need to add loadmask here
        this.setLoading({xtype: 'loadmask', message: "loading..."});
        
        this.retrievingData = true;
        
        Ext.Ajax.request({
            method: 'GET',
            url: record.get('link'),
            useDefaultXhrHeader: false,
            success: onSuccess,
            failure: loadingError()
        });
        
        var loadingError = function() {
            if(me.retrievingData) {
                alert("failed to retrieve: " + url);
                me.retrievingData = false;
                me.setLoading(false);
            }
        };
        
        Ext.defer(loadingError, 5000, this);
    },

    processDoc: function(xml) {
        var parser=new DOMParser();
        var	xmlDoc=parser.parseFromString(xml,"text/xml");
        
        var topcontainer = this.xmlToJson(xmlDoc);  // computesystems
        console.log(topcontainer);
        
        var models = [];
        
        function addLink(element) {
        
            if(!element.link) {
                console.log("no links in element");
                console.log(element);
                return;
            }
        
            for (var child in element.link) {
                var url = "";
                if(child == '@attributes') {
                    url = element.link[child].href;
                } else {
                	url = element.link[child]['@attributes'].href;
                }
                var name = url.split('/').pop();
                addModel(name, url);
            }
        }
        
        function addChild(type, element) {
            var name = getText(element.name);
            var alias = getText(element.alias);
            var text = type;
            if(name) {
        		text = name;
            } else if (alias) {
                text = alias;
            }
            var url = getText(element.url);
            addModel(text, url);
        }
        
        function addModel(name, link) {
            var model = Ext.create('MyApp.model.TreeModel', {
                text: name,
                link: link
            });
            models.push(model);
        }
        
        function getText(element) {
            if(element && '#text' in element) {
               return element['#text'];
            }
        }
        
        for(var i in topcontainer) {
        
            if(i == '#text') {
                continue;
            }
        
            var elements = topcontainer[i];
        
            if (i == 'link') {
                addLink(elements);
                continue;
            }
        
            for(var j in elements) { // computesystem[]
        
                if(j == '#text') {
                    continue;
                }
        
                var element = elements[j]; // computesystem // might be an array
        
                if (j == 'link') {
                	addLink(elements);
                	continue;
            	}
        
                if (Ext.isArray(element)) {
                    for(var k in element) {
                        addChild(j, element[k]);
                    }
                } else {
        			addLink(element);
                }
            }
        
        }
        
        return models;
    },

    setLoading: function(loading) {
        this.getApplication().getController('NavSheetController').setLoading(loading);
        
    }

});