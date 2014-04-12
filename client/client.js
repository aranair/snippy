// # 
// # Deps.autorun ->
// # 	Meteor.subscribe("snippets", Session.get('searchQuery'))
// # 
// # if Meteor.is_client
// #   # re = new RegExp('page-header', 'i')
// #   # re = new RegExp(Session.get('searchQuery'), 'i')
// #   # Template.snippetslist.snippets = -> Snippets.find({'content':{$regex:re}}, {sort: {created_at:-1}})
// #   Template.snippetslist.snippets = -> Snippets.find({sort: {created_at:-1}})
// # 		
// #   Template.snippetslist.events =
// #     'submit #new_snippet': (event) ->
// #       event.preventDefault()
// #       Meteor.call('createSnippet', {content:$('#new_snippet_content').val()}, (e, p) -> if p == false
// #         $('#createalert').css('display', 'block')
// #       )
// #       # Snippets.insert({content:$('#new_snippet_content').val(), created_at: (new Date())})
// #       $("#new_snippet_content").val("")
// # 		
// # 	Template.snippet.events = 
// # 		'click .delete_snippet': (event) ->
// # 			event.preventDefault()
// # 			Snippets.remove(this._id)
// # 	
// # 	Template.snippetslist.rendered = ->
// # 		$("code").each (i, e) ->
// # 		  hljs.highlightBlock e,'    ', false
// # 		
// # 	Template.searchform.events =
// # 		'change .searchText': (event) ->
// # 			Session.set('searchQuery', $(".searchText").val())


Meteor.startup(function() {
	if (Session.get('searchQuery')) {
		$(".searchText").val(Session.get('searchQuery'))
	}
	Deps.autorun(function() {
	  // return Meteor.subscribe("snippets", Session.get('searchQuery'));
		Meteor.subscribe("snippets")
	});
})


if (Meteor.is_client) {
	
  function SelectText(element) {
      var doc = document
          , text = doc.getElementById(element)
          , range, selection
      ;    
      if (doc.body.createTextRange) { //ms
          range = doc.body.createTextRange();
          range.moveToElementText(text);
          range.select();
      } else if (window.getSelection) { //all others
          selection = window.getSelection();        
          console.log(selection);
          range = doc.createRange();
          console.log(range);
          console.log(text);
          range.selectNodeContents(text);

          selection.removeAllRanges();
          selection.addRange(range);
      }
  }
  Template.snippetslist.snippets = function() {
	  if (!Session.get('searchQuery')) {
			return Snippets.find({}, {sort: {created_at: -1}})
		} else {
			return Snippets.find({content:{$regex:Session.get('searchQuery'), $options: 'i'}},{sort: {created_at: -1}});
		}
  };
  Template.snippetslist.events = {
    'submit #new_snippet': function(event) {
      event.preventDefault();
      Meteor.call('createSnippet', {
        content: $('#new_snippet_content').val()
      }, function(e, p) {
        if (p === false) {
          $('#createalert').css('display', 'block');
        }
      });
      $("#new_snippet_content").val("");
    }
		// ,
		// 'keyup #new_snippet_content':function (event) {
		// 			console.log(event.srcElement)
		// 			if (event.keyCode == 86 && (event.metaKey || event.ctrlKey)) {
		// 				
		// 				setTimeout(function () { 
		// 						console.log($("#new_snippet_content").val())
		// 				    }, 100);
		// 				event.preventDefault();
		// 				Meteor.call('createSnippet', {
		// 	        content: $("#new_snippet_content").val()
		// 	      }, function(e, p) {
		// 	        if (p === false) {
		// 	          $('#createalert').css('display', 'block');
		// 	        }
		// 	      });
		// 	      $("#new_snippet_content").val("");
		// 			}
		// 		}
  };
	
	Template.snippet.events = {
	  'click .delete_snippet': function(event) {
	    event.preventDefault();
			var currentId = this._id
			$('#current_delete_id').val(currentId)
			$('#modal-from-dom').modal('show');
			// var confirmWin = window.confirm("Delete this snippet?")
			// if (confirmWin)
				// Snippets.remove(this._id);
	  },
		'click .select_snippet': function(event) {
			event.preventDefault();
			var id = $(event.target).data('id')
		 	SelectText(id);
		}
	};
	
	Template.bootstrapConfirmation.events = {
		'click .confirm_delete': function (event) {
			event.preventDefault();
			var deleteId = $('#current_delete_id').val()
			$('#modal-from-dom').modal('hide');
			$('#current_delete_id').val('')
			Snippets.remove(deleteId);
		}
	};

	Template.snippetslist.rendered = function() {
		searchQuery = Session.get('searchQuery')

	  $("pre code").each(function(i, e) {
	    hljs.highlightBlock(e, '    ', false);
			$(e).highlight(searchQuery)
	  });
	};

	Template.searchform.events = {
		'keyup .searchText': function(event) {
	    Session.set('searchQuery', $(".searchText").val());
	  }
	};
}

