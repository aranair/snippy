if (Meteor.isClient) {
  Meteor.startup(function() {
    if (Session.get('searchQuery')) {
      $(".js-search-text").val(Session.get('searchQuery'))
    }
    Deps.autorun(function() {
      // Meteor.subscribe("snippets", Session.get('searchQuery'));
      Meteor.subscribe("snippets", function onComplete() {
        var client = new ZeroClipboard($('.js-clipboard-button'));
        client.on( "load", function( readyEvent ) {
          client.on( "aftercopy", function( event ) {
            // `this` === `client`
            // `event.target` === the element that was clicked
            event.target.style.display = "none";
            alert("Copied text to clipboard: " + event.data["text/plain"] );
          } );
        });
      })
    });
  })
	
  // Selects the snippet  when you click on the panel
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
      range = doc.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  Template.snippetslist.snippets = function() {
	  if (!Session.get('searchQuery')) {
			return Snippets.find({}, {sort: {created_at: -1}})
		} else {
			return Snippets.find({
        content: { $regex:Session.get('searchQuery'), $options: 'i' }
      }, { sort: { created_at: -1 } });
		}
  };
  Template.snippetslist.events = {
    'click .form__save-btn': function(event) {
      event.preventDefault();
      var newSnippetContent = $('.js-new-snippet-content').val();
      if (newSnippetContent === '') { return; }

      Meteor.call('createSnippet', { content: newSnippetContent }, function(e, p) {
        if (!p) { $('.js-create-alert').css('display', 'block'); }
      });
      $('.js-new-snippet-content').val('');
    }
  };
	
	Template.snippet.events = {
	  'click .js-delete-snippet': function(event) {
			var currentId = this._id
			$('.js-current-delete-id').val(currentId)
	  },
		'click .js-select-snippet': function(event) {
			event.preventDefault();
			var id = $(event.target).data('id')
		 	SelectText(id);
		}
	};
	
	Template.bootstrapConfirmation.events = {
		'click .confirm_delete': function (event) {
			event.preventDefault();
			var deleteId = $('.js-current-delete-id').val()
			$('.js-delete-modal').modal('hide');
			$('.js-current-delete-id').val('')
			Snippets.remove(deleteId);
		}
	};

	Template.snippetslist.rendered = function() {
		searchQuery = Session.get('searchQuery')

	  $("pre code").each(function(i, e) {
	    // hljs.highlightBlock(e, '', false);
	    hljs.highlightBlock(e);
			$(e).highlight(searchQuery)
	  });
	};

	Template.searchform.events = {
		'keyup .js-search-text': function(event) {
	    Session.set('searchQuery', $('.js-search-text').val());
	  }
	};
}
