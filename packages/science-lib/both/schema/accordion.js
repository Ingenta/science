/**
 * Created by jiangkai on 16/2/25.
 */
Science.schemas.CollapsItemSchema = new SimpleSchema({
    title:{
        type: Science.schemas.MultipleTextOptionalSchema,
        unique: false
    },
    content:{
        type: Science.schemas.MultipleTextAreaSchema,
        optional: true
    }
});