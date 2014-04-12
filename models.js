Snippets = new Meteor.Collection("snippets")

Snippets.allow({
	insert: function () {
		return false;
	},
	update: function (userId, snippet) {
		if (userId !== party.owner)
		return false; // not the owner

		return true;
	},
	remove: function (userId, snippet) {
		// You can only remove parties that you created and nobody is going to.
		return snippet.owner === userId;
	}
});


Meteor.methods({
	resetLatest: function () {
		Snippets.update({}, {$set: {latest:false}}, {multi:true})
	},

	createSnippet: function (options) {
		if (!this.userId) return false;

		return Snippets.insert({
			owner	 : this.userId,
			content: options.content,
			created_at: (new Date())
		});
	}
})