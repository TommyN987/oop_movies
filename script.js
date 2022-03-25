// MOVIE CLASS

class Movie {
  constructor(title, director, year) {
    this.title = title
    this.director = director
    this.year = year
  }
}

// LOCAL STORAGE OPERATIONS

class Store {

  static getMovies() {
    let movies;
    
    if(localStorage.getItem('movies') === null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem('movies'));
    }

    return movies;
  }

  static addMovie(movie) {
    const movies = Store.getMovies();
    movies.push(movie);
    localStorage.setItem('movies', JSON.stringify(movies))
  }

  static removeMovie(title) {
    const movies = Store.getMovies();

    movies.forEach((movie, index) => {
      if (movie.title === title) {
        movies.splice(index, 1);
      }
    })

    localStorage.setItem('movies', JSON.stringify(movies));
  }

}

// UI OPERATIONS

class UI {
  
  static displayMovies() {
    const movies = Store.getMovies();

    movies.forEach((movie) => UI.addMovieToList(movie));
  }

  static addMovieToList(movie) {
    
    // GET + CREATE DOM ELEMENTS

    const list = document.getElementById('movie-list');
    const row = document.createElement('tr');
    const title = document.createElement('td');
    const director = document.createElement('td');
    const year = document.createElement('td');
    const btnDelete = document.createElement('div');

    // ASSIGN VALUES TO THE ELEMENTS

    title.innerText = movie.title;
    director.innerText = movie.director;
    year.innerText = movie.year;
    btnDelete.innerHTML = `<a href='#' class='btn btn-danger btn-sm delete'>X</a>`;
    btnDelete.addEventListener('click', (e) => {
      e.target.parentElement.parentElement.remove();
      Store.removeMovie(movie.title);
      UI.showAlert('Movie deleted.', 'success');
    });

    // DISPLAY THE ELEMENTS

    list.insertBefore(row, list.children[0]);
    row.appendChild(title);
    row.appendChild(director);
    row.appendChild(year);
    row.appendChild(btnDelete);

  }

  static showAlert(message, className) {
    const container = document.querySelector('.container');
    const form = document.getElementById('movie-form');
    
    const div = document.createElement('div');
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message));

    container.insertBefore(div, form);

    // VANISH ALERT AFTER 3 SECONDS

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

}

document.addEventListener('DOMContentLoaded', UI.displayMovies);


// ADD A MOVIE

document.addEventListener('submit', (e) => {
  e.preventDefault();

  // get form values

  const form = document.getElementById('movie-form');
  const title = document.getElementById('title').value;
  const director = document.getElementById('director').value;
  const year = document.getElementById('year').value;
  
  // form validation

  if (title === '' || director === '' || year === '') {
    UI.showAlert('Please fill out all the fields', 'danger');
  } 
  
  else {
    const movie = new Movie(title, director, year);
    UI.addMovieToList(movie);
    Store.addMovie(movie);
    UI.showAlert('Movie added.', 'success');
    form.reset();
  }
})