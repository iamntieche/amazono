const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseAlgolia = require('mongoose-algolia'); 

const ProductSchema = new Schema({
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews:[{type:Schema.Types.ObjectId,ref: 'Review'}],
    image: String,
    title: String,
    description: String,
    price: Number,
    crated: {type: Date, default:Date.now}
},
{
    toObject: {virtuals : true},
    toJSON: {virtuals : true}
}
);

ProductSchema
    .virtual('averageRaiting')
    .get(function(){
        var raiting = 0;
        if(this.reviews.length == 0){
            raiting = 0;
        }else{
            this.reviews.map((review) => {
                raiting+= review.raiting;
            });
            raiting = raiting / this.review.raiting.length;
        }

        return raiting;
    });

ProductSchema.plugin(deepPopulate);
ProductSchema.plugin(mongooseAlgolia, {
    appId: 'MWQRCEKTQ6',
    apiKey: 'e86ebd3d62748dd0783be0f40264ade5',
    indexName: 'amazonov1',
    selector: ' _id title image reviews description price owner created',
    populate: {
        path: 'owner reviews',
        select: 'name rating'
    },
    defaults: {
        author: 'uknown'
    },
    mappings: {
        title: function(value){
            return `${value}`
        }

    },
    virtuals: {
        averageRaiting: function(doc){
            var raiting = 0;
            if(doc.reviews.length == 0){
                raiting = 0;
            }else{
                doc.reviews.map((review) => {
                    raiting+= review.raiting;
                });
                raiting = raiting / doc.review.raiting.length;
            }
    
            return raiting;
        }
    },
    debug: true
});

let Model = mongoose.model('Product', ProductSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
    searchableAttributes: ['title']
});
module.exports = Model