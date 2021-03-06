const Offer = {
    data() {
      return {
        person: {},
        books: [],
        offers: [],
        booksForm: {},
        selectedBook: null
        }
    },

    computed: {
      prettyBirthday() {
        return dayjs(this.person.dob.date)
        .format('D MMM YYYY');
      }
    },

    methods: {

       fetchBooksData() {
            fetch('/api/books/')
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.books = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })   
      }, 
      
        fetchUserData() {
          console.log("A");

          fetch('https://randomuser.me/api/')
          .then(response => response.json())
          .then((parsedJson) => {
              console.log(parsedJson);
              this.person = parsedJson.results[0]
              console.log("C");
          })
          .catch( err => {
              console.error(err)
          })
  
          console.log("B");
        },

        postNewBook(evt){
          console.log("Creating!", this.booksForm);

          fetch('api/books/create.php',{
              method:'POST',
              body: JSON.stringify(this.booksForm),
              headers:{
                  "Content-Type": "application/json; charset=utf-8"
              }
          })
          .then( response => response.json() )
          .then( json => {
              console.log("Returned from post:", json);
              this.books = json;
              this.booksForm = {};
              this.handleResetEdit();
          });          
      }, 
      postEditBook(evt) {
        
        console.log("Editing!", this.booksForm);

        fetch('api/books/update.php', {
            method:'POST',
            body: JSON.stringify(this.booksForm),
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          })
          .then( response => response.json() )
          .then( json => {
            console.log("Returned from post:", json);
            // TODO: test a result was returned!
            this.books = json;
            
            // reset the form
            this.handleResetEdit();
          });
      },

        postDeleteBook(o) {  
          if ( !confirm("Are you sure you want to delete the book " + o.Title + "?") ) {
              return;
          }  
          
          console.log("Delete!", o);

          fetch('api/books/delete.php', {
              method:'POST',
              body: JSON.stringify(o),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.books = json;
              
              // reset the form
              this.handleResetEdit();
            });
        },

       handleResetEdit() {
          this.selectedBook = null;
          this.booksForm = {};
      },
        handleEditBook(book) {
          this.selectedBook = book;
          this.booksForm = Object.assign({}, this.selectedBook);
    },
        selectBook(o) {
          if (o == this.selectedBook) {
              return;
          }
          this.selectedBook = o;
          this.books = [];
          this.fetchBooksData(this.selectedBook);
  },
        postBook(evt) {
            console.log ("Test:", this.selectedBook);
          if (this.selectedBook) {
              this.postEditBook(evt);
          } else {
              this.postNewBook(evt);
          }
        }


    }, 

    created() {

      this.fetchBooksData();
      this.fetchUserData();

    }
  }
  
Vue.createApp(Offer).mount('#table');