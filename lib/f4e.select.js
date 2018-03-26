(function($, window, document){
    "use strict";
    
    var defaults = {
        multiple : true,
        searchNoItem : 'No item found',
        seperator : ', ',
        displayToolbar : true,
        searchType : 'contains',
        disableSort : false
    };
    
    var templates = {
            searchBox : Handlebars.compile('<div class=\'searchbox-container\'>' + 
                            '<input type=\'text\' class=\'searchbox\'>'+ 
                            '<div style=\'position:absolute;right:22px;top:13px\'>' +
                                '<i class=\'fa fa-search\' style=\'margin-right:-10px\'/>' +
                            '</div>' +                        
                        '</div>'),
            newOption : Handlebars.compile('{{#if newOptionEnabled}}' +                    
                                            '<div class=\'addnew\'><a class=\'f4-add-new-button\'>{{newOptionText}}</a></div>' +
                                            '{{/if}}' +
                                            '{{#if descriptionEnabled}}'+ 
                                            '<div class=\'addnewdescription\'>{{description}}</div>' + 
                                            '{{/if}}'),
        
            toolbar : Handlebars.compile('<div class=\'f4e-toolbar\'>' + 
                                             '{{#if multiple}}' + 
                                                 '<i class=\'f4e-toolbarbutton fa fa-fw fa-check\'/>' +
                                                 '<i class=\'f4e-toolbarbutton fa fa-fw fa-remove\'/>' + 
                                             '{{/if}}' + 
                                             '{{#if disableSort}}' +
                                                '<div></div>' +
                                             '{{else}}' + 
                                                '<i class=\'f4e-toolbarbutton fa fa-fw fa-sort\'/>' + 
                                             '{{/if}}' +
                                         '</div>'),
            
            menuItems : Handlebars.compile('<div class=\'f4e-menu-items\'' + 'style=\'max-height:{{menuItemsMaxHeight}}vh;overflow:auto\'>' + 
                                              '{{#if nooptions}}' +
                                                    '<div class=\'no-search\'>{{noSearchFoundText}}</div>' +
                                              '{{else}}' +
                                                '{{#each options}}'  +
                                                      '{{#if isDataDividerEnabled}}' +
                                                      '<hr/>' + 
                                                      '{{else}}' + 
                                                            '{{#if isDisabled}}' + 
                                                                '<div class=\'f4e-menu-item\' disabled style=\'line-height:4vh\' val=\'{{val}}\'>' + 
                                                            '{{else}}' +
                                                                '<div class=\'f4e-menu-item\' style=\'line-height:4vh\' val=\'{{val}}\'>' + 
                                                            '{{/if}}' +

                                                            '{{#if isfaClassEnabled}}' +
                                                                '<i class=\'{{faClass}}\' style=\'margin-right:5px\'/>' +
                                                            '{{/if}}' +

                                                            '{{#if isDataContentEnabled}}' + 
                                                                '{{{dataContent}}}'+
                                                            '{{else}}' + 
                                                                '<span>{{optionText}}</span>' +
                                                            '{{/if}}' +

                                                            '{{#if isDataSubtextEnabled}}' + 
                                                                '<small class=\'f4e-subtext\'>{{dataSubtext}}</small>' +
                                                            '{{/if}}' +                                                
                                                            '{{#if isChecked}}' + 
                                                                '<i class=\'fa fa-check\' style=\'margin-left:5px\'/>' +
                                                            '{{/if}}'+
                                                            '</div>' +
                                                      '{{/if}}' + 
                                                  '{{/each}}' + 
                                              '{{/if}}'+                                           
                                          '</div>'
                                           
                                          )
        
    };
    
    
    
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    }
    
    function guid(){
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }
    
    function dropdown(element,options){
        this.$selectElement = $(element);
        
        options.size = this.$selectElement.attr('data-size');
        options.seperator = this.$selectElement.attr('data-seperator');
        options.displayToolbar = !this.$selectElement[0].hasAttribute('data-disabletoolbar');         
        options.searchNoItem = this.$selectElement.attr('data-searchNoItem');
        options.multiple = this.$selectElement[0].hasAttribute('data-multiple');
        options.searchType = this.$selectElement.attr('data-searchtype');
        options.disableSort = this.$selectElement[0].hasAttribute('data-disablesort');
        this.settings = $.extend( {}, defaults, options );
        
        this.selectedItems = [],
        this.$dropDown = null,
        this.sortedBy = '';
        this.init();
                             
    }
    
    dropdown.prototype = {
        
        init : function(){
            var selecttext = this.$selectElement.attr('data-selecttext');            
            this.$dropDown = $('<div class=\'f4e-dropdown\'><a class=\'f4e-button\'>' + selecttext + '</a></div>')
            this.$selectElement.after(this.$dropDown);
            this.$selectElement.css('display', 'none'); 
            this.bindEvents();
        },
        
        bindEvents : function(){
            var _this = this;
            
            $(window).on('click', function(e){
                _this.destroyMenu();
            });
            
            this.$dropDown.on('click',function(e){
                e.stopPropagation();
            });
            
             this.$dropDown.on('click', '.f4e-button',function(e){
                _this.clickOpenMenuCallback(e);
            });
            
            this.$dropDown.on('click', '.f4e-menu-item',function(e){
                 var selectedItem = {
                    val : $(this).attr('val'),
                    text : $(this).text()
                 }
                _this.clickMenuItemCallback(e,selectedItem);
            }); 
            
            
            this.$dropDown.on('keyup', '.searchbox',function(e){
                var searchText = $(this).val();
                _this.typeSearchBoxCallback(e, searchText);
            });
            
        
            this.$dropDown.on('click', '.f4-add-new-button', function(e){                                
                _this.clickAddNewOptionCallback(e);
            });        
            
            this.$dropDown.on('click', '.fa-check', function(e){
                _this.selectAllItemsCallback(e);
            });        
                        
            this.$dropDown.on('click', '.fa-remove', function(e){
                _this.clickDeselectAllCallback(e);
            }); 
            
            this.$dropDown.on('click', '.fa-sort', function(e){
                _this.clickSortAllCallback(e);
            });
            
        },
        
        clickDeselectAllCallback : function(){
            if(this.selectedItems.length == 0) return;
            this.selectedItems = [];
            this.$selectElement.find('option').removeAttr('selected');
            
            if(this.settings.ondeselectall != null)
                this.settings.ondeselectall();
            
            this.setButtonText();
            this.$dropDown.find('.f4e-menu-item .fa-check').remove();
        },
        
        clickAddNewOptionCallback : function(e){
            var newItem = this.$dropDown.find('.searchbox').val();
            if(newItem != ''){
                var strGuid = guid();
                if(this.settings.onitemadd != null)
                {
                    var newItemVal = this.settings.onitemadd(newItem);
                    if(newItemVal != null)
                        strGuid = newItemVal;
                }
                    
                this.$selectElement.prepend('<option val=\'' + strGuid + '\'>' + newItem + '</option>');
                this.selectItem({
                    val : strGuid,
                    text : newItem
                });
               
                this.$dropDown.find('.f4e-menu-items').remove();            
                this.$dropDown.find('.searchbox-container').after($(this.renderMenuItems()));            
            }
        },
        
        typeSearchBoxCallback : function(e, searchText){
            
            this.$dropDown.find('.f4e-menu-items').remove();            
            this.$dropDown.find('.searchbox-container').after($(this.renderMenuItems(searchText)));            
        },
    
        clickMenuItemCallback : function(e, selectedItem){           
            this.selectItem(selectedItem);           
        },
        
        clickOpenMenuCallback : function(e){
            //check if already open
           if(this.$dropDown.find('.f4e-menu-items').length == 0)
                this.displayMenu();
            else
                this.destroyMenu();            
        },
            
        selectAllItemsCallback : function(e){
            var $options = this.$selectElement.find('option:not([disabled])');
            
            var maxOptions = this.settings.maxOptions;
            if(maxOptions == null || (maxOptions >= $options.length))
            {            
                this.selectedItems = $.map($options, function(option, i){
                    return {
                        val : $(option).attr('val'),
                        text : $(option).text()
                    }
                });
                this.$selectElement.find('option:not([disabled])').attr('selected', true);
                
                if(this.settings.onselectall != null)
                    this.settings.onselectall();
            
                this.setButtonText();
                this.$dropDown.find('.f4e-menu-item .fa-check').remove();
                this.$dropDown.find('.f4e-menu-item').append('<i class=\'fa fa-check\' style=\'margin-left:5px\'/>');
                return $options.length;
            }
            else{
                return 0;    
            }
        },
        
        clickSortAllCallback : function(){
            if(this.sortedBy== '' || this.sortedBy== 'desc'){
                this.$selectElement.find('option').sort(function(a,b){                
                   return $(a).text() > $(b).text(); 
                }).appendTo(this.$selectElement);
                this.sortedBy = 'asc';
            }
            else{
                this.$selectElement.find('option').sort(function(a,b){                
                   return $(a).text() < $(b).text(); 
                }).appendTo(this.$selectElement);                
                this.sortedBy = 'desc';
            }
            
            this.$dropDown.find('.f4e-menu-items').remove();            
            this.$dropDown.find('.searchbox-container').after($(this.renderMenuItems()));      
        },
        
        renderMenu : function(){
            var text = '<div class=\'f4e-menu\'>';
            text += '<div>'
            text += this.renderSearchBox();           
            text += this.renderMenuItems(); 
            text += this.renderNewOption();
            text += '</div>';
            if(this.settings.displayToolbar)
                text += this.renderToolbar();           
            text += '</div>';
            return text;
        },
        
        renderToolbar : function(){
            
            var context = {
                multiple : this.settings.multiple,
                disableSort : this.settings.disableSort
            }
            
            return templates.toolbar(context);            
        },
        
        renderNewOption : function(){
            
            var context = {
                newOptionEnabled : this.$selectElement.attr('data-newoption') != null,
                newOptionText : this.$selectElement.attr('data-newoption'),
                descriptionEnabled : this.$selectElement.attr('data-description') != null,
                description : this.$selectElement.attr('data-description')
            };
            
            return templates.newOption(context);
        },
        
        renderSearchBox : function(){
            return templates.searchBox({});
        },
        
        renderMenuItems : function(searchtext){
            var _this = this;
            var size = this.settings.size;
            var $options = this.$selectElement.find('option');
            
            var context = {
                menuItemsMaxHeight : 18,
                menuItemLineHeight : 4,
                options : [],
                searchText : searchtext
            };

            if(size != null){
               context.menuItemsMaxHeight = size * 6;
            }

            $options.each(function(index){
                var val = $(this).attr('val');
                var optionText = $(this).text();
                var faclass = $(this).attr('class');
                var disabled = $(this).attr('disabled');
                var data_content = $(this).attr('data-content');
                var data_subtext = $(this).attr('data-subtext');
                var data_divider = $(this).attr('data-divider');
                
                if(searchtext != null){
                    var idx = optionText.toLowerCase().indexOf(searchtext.toLowerCase());
                    if(_this.settings.searchType == 'contains' && idx == -1)
                        return true;
                    if(_this.settings.searchType == 'starts' && idx != 0 )
                        return true;
                }
                
                context.options.push({
                   val : val,
                   optionText : optionText,
                   isfaClassEnabled : faclass != null,
                   faClass : faclass,
                   isDisabled : disabled != null,
                   isDataContentEnabled : data_content != null,
                   dataContent : data_content,
                   isDataSubtextEnabled : data_subtext != null,
                   dataSubtext : data_subtext,
                   isDataDividerEnabled : data_divider != null,
                   isChecked : _this.selectedItems.findIndex(function(el){return el.val == val;}) != -1,
                   noSearchFoundText : _this.settings.searchNoItem 
                });
            });
            
            context.nooptions = context.options.length ==0 && searchtext != null;            
            return templates.menuItems(context);;
        },        
                  
        setButtonText : function(){
            var _this = this;
            var text = '';            
            if(this.selectedItems.length > 0){
                this.selectedItems.forEach(function(el, index){                
                    text += el.text;
                    if(index != _this.selectedItems.length-1){
                        text += _this.settings.seperator;
                    }
                });
            }
            else{
                text = this.$selectElement.attr('data-selecttext');
            }
            
            
            this.$dropDown.find('.f4e-button').text(text);
        },
        
        displayMenu : function(){            
            var $menu = $(this.renderMenu());
            this.$dropDown.find('.f4e-button').next().remove();
            this.$dropDown.find('.f4e-button').after($menu);
            if(this.settings.onopen != null)
                this.settings.onopen();
        },
        
        destroyMenu : function(){
            this.$dropDown.find('.f4e-menu').remove();
            if(this.settings.onclose != null)
                this.settings.onclose();
        },
        
        selectItem : function(selectedItem){
              var idx = this.selectedItems.findIndex(function(el){
                return el.val == selectedItem.val;
            });
            
            var isDisabled = this.$dropDown.find('.f4e-menu-item[val="' + selectedItem.val + '"]').hasClass('disabled');
            if(isDisabled)
                return;
            
            if(idx == -1){
                if(this.settings.multiple)
                {
                    var maxOptions = this.settings.maxOptions;
                    if(maxOptions == null)
                        this.selectedItems.push(selectedItem);
                    else if(maxOptions != null && this.selectedItems.length + 1 <= maxOptions)
                        this.selectedItems.push(selectedItem);
                    else
                        return;
                    
                    this.$dropDown.find('.f4e-menu-item[val="' + selectedItem.val + '"]').append('<i class=\'fa fa-check\' style=\'margin-left:5px\'/>');
                }
                else{
                    this.selectedItems = [selectedItem];
                    this.destroyMenu();
                }
                
                if(this.settings.onselect != null){
                    this.settings.onselect(selectedItem);
                }
                
                this.$selectElement.find('option[val="' + selectedItem.val + '"]').attr('selected', true);                  
                this.setButtonText();
                
            }
            else{
                //remove
                this.selectedItems.splice(idx, 1);
                if(this.settings.ondeselect != null){
                    this.settings.ondeselect(selectedItem);
                }
                this.$selectElement.find('option[val="' + selectedItem.val + '"]').removeAttr('selected');
                this.setButtonText();
                if(this.settings.multiple)
                    this.$dropDown.find('.f4e-menu-item[val="' + selectedItem.val + '"] .fa-check').remove();
                else
                    this.destroyMenu();
            }                                  
        },
        
    };
    
    $.fn[ 'f4eselect' ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, 'f4eselect' ) ) {
					$.data( this, 'f4eselect', new dropdown( this, options ) );
				}
			} );
		};
    
}(jQuery, window, document));