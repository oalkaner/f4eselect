# f4eselect
Jquery based multi select dropdown with create new option. It styles and adds new features to native html select element such as search , sort, multi-select, select all, deselect all, custom styled options, limiting max selection, adding new options on the fly.

# Samples
[Click](https://oalkaner.github.io/f4eselect/) to see sample configurations

# Install
Copy the contents of the dist directory to your project's installation path. f4eselect is dependent on jquery, handlebars, font-awasome which can be referenced by bower_components directory.
```
  <script src='../bower_components/jquery/dist/jquery.min.js'></script>
  <script src="../bower_components/handlebars/handlebars.min.js"></script>
  <script src="../dist/f4e.select.min.js"></script>
  <link   href="../dist/f4e.select.css" rel="stylesheet" type="text/css" >
  
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

  <script>
       $(document).ready(function(){
          $('.select').f4eselect();                  
       });
  </script>

  <select class="select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    <option value="4">Option 4</option>
    <option value="5">Option 5</option>
   </select>

```

# Callbacks

| Property | Description |
| ------------- | ------------- |
| onSelect  | calls a function when an item is selected, selected item is returned as a parameter  |
| onDeselect  | calls a function when an item is deselected, deselected item is returned as a parameter with val and text attributes |
| onSelectAll | calls a function when all items are selected |
| onDeselectAll | calls a function when all items are deselected |
| onNewOption | calls a function when an item is added. text paremeter is returned with new item text. If function returns a value, this is used as value for the newly created option. Otherwise plugin generates a GUID as value for the newly generated option  |
| onOpen | calls a function when menu is opened |
| onClose | calls a function when menu is closed |

# Data Attributes on Select Element

| Data Attribute | |
| ------------- | ------------- |
| selecttext  | default selection text  |
| multiple  | Is list multi-selected or not , default is multi selectable|
| search | Is search box enabled |
| searchType | type of the search contains or starts |
| searchNoItem | Text to be displayed when item not found |
| newoption | New item button text , default not displayed |
| description | Description text of the select box , default not displayed |
| size | Number of items visible when menu is opened |
| toobar | Enable/disable toolbar , default is enabled |
| sort | Enable/disable sort , default is enabled |
| seperator | Item seperator text on select button |

# Data Attributes On Option Elements

| Data Attribute | |
| ------------- | ------------- |
| subtext | subtext display right next to option text |
| content | when set contents of context is displayed rather then option text |
| divider | displays a divider instead of select element |
| class | adds an <i> element left to menu item. e.g. class='fa fa-eye'|

# Methods

| Method | |
| ------------- | ------------- |
| $(selector).f4eselect(options)  | Initialize the plugin with options  |
| $.f4eselect.getSelected(el) | returns currently selected elements |
| $.f4eselect.setSelected(el, value)| selects option with specified value |
| $.f4eselect.close(el) | closes select  menu |
| $.f4eselect.open(el) | opens select menu |
| $.f4eselect.destroy(el) | destroys select element |
| $.f4eselect.addOption(el, option , index) | Adds a new option to specifed index. option object = {value = '785', text='New Option'} |
| $.f4eselect.removeOption(el,value) | Removes option with value |


