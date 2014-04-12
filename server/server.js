
Meteor.publish("snippets", function () {
	return Snippets.find({owner: this.userId}, {sort:{created_at: -1}})
});
