# f4eselect
Jquery based multi select dropdown with create new option. It styles and adds new features to native html select element such as search , sort, multi-select, select all, deselect all, custom styled options, limiting max selection, adding new options on the fly.
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
    <option value="">Please select...</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    <option value="4">Option 4</option>
    <option value="5">Option 5</option>
   </select>

```
