import { Schema, model } from 'mongoose';

const ListSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
     description: {
        type: String
     },
     genre: {
         type: String
     },
     content: {
         type: Array,
     }
}, 
{
    timestamps: true 
})

module.export = model("List", ListSchema)