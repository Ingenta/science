/**
 * Created by jiangkai on 16/2/25.
 */
Science.schemas.CollapsItemSchema = new SimpleSchema({
    title:{
        type: String,
        unique: false
    },
    content:{
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor'
            }
        }
    }
});

Science.schemas.AccordionSchema = new SimpleSchema({
    title:{
        type:String
    },
    items:{
        unique:false,
        type:[Science.schemas.CollapsItemSchema]
    }
});