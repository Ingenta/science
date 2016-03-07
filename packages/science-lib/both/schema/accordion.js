/**
 * Created by jiangkai on 16/2/25.
 */
Science.schemas.CollapsItemSchema = new SimpleSchema({
    title:{
        type: Science.schemas.MultipleTextAreaSchema,
        unique: false
    },
    content:{
        type: Science.schemas.MultipleTextAreaSchema,
        optional: true
    }
});

Science.schemas.AccordionSchema = new SimpleSchema({
    title:{
        type:String,
        optional:true
    },
    items:{
        unique:false,
        optional:true,
        type:[Science.schemas.CollapsItemSchema]
    }
});