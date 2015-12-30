starterControllers.factory('Word',function(){
                function Word( wordResult ) {
                    this.id = wordResult.id;
                    this.title = wordResult.title;
                    var highlightPattern = /@(.*)/g
                    var str = wordResult.content;
                    
                    this.content = str.replace( highlightPattern, "<b>$1</b>");
                    this.stripContent = str.replace( highlightPattern, "").replace(/<[^>]+>/ig,"") 

                    this.speech = wordResult.speech;
                    this.voice = wordResult.voice;
                }
                // Define the "instance" methods using the prototype
                // and standard prototypal inheritance.
                Word.prototype = {
                    getStripContent: function() {
                        return( this.content.replace(/<[^>]+>/igm,"") );
                    }
              
                };
                // Define the "class" / "static" methods. These are
                // utility methods on the class itself; they do not
                // have access to the "this" reference.
                Word.next = function( id ) {
               
                };
                // Return constructor - this is what defines the actual
                // injectable in the DI framework.
                return( Word );
            }
        );
