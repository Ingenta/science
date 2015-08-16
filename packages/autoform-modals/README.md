Meteor [Autoform](https://github.com/aldeed/meteor-autoform) Modals
========

Adds bootstrap modals to update doc's fields from a template.

## Setup ##

1. ```meteor add jackjiang:autoform-modals```
2. Include the template in the layouts that will use the modals `{{> jkautoformModals}}`
3. Use `jkafModal` template to create a button that will trigger the modal

### Example ###

#### define a template for update some fields ####

```
<template name="updateArticleTitleModalForm">
	{{#autoForm schema="onlyTitle" collection="Articles" id="updateArticleTitleForm" doc=this type="update" buttonContent="update"}}
		{{> afObjectField name="title"}}
		<button type="submit" class="btn btn-primary">update</button>
	{{/autoForm}}
</template>
```
#### call jkafModal ####

```
{{#jkafModal template="updateArticleTitleModalForm" doc=this id="updateArticleTitleForm" class="fa fa-pencil"}}
  update
{{/jkafModal}}
```