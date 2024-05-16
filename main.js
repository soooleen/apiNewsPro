const API_KEY = `cc6fa49ea5c045f089ad19809cfac339`;
let newsList = [];
// let category = "general";
let sportsButton = document.getElementById("sports-button");
let scienceButton = document.getElementById("science-button");
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

let totalResult = 0;
let page = 1;
const pageSize = 10;
const GroupSize = 5;

const getLatestNews = () => {
    url = new URL(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    );
    getNews();
  };
  
  const getNewsByCategory = (event) => {
    const category = event.target.textContent.toLowerCase(); 
    console.log("category", category);
    url = new URL(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
    );
    getNews();
  };
  
  const getNewsByKeyword = async () => {
    keyword = document.getElementById("search-input").value;
    url = new URL(
      `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
    );
    getNews();
  };

const getNews = async() => {
    try {
        url.searchParams.set("page", page); 
        url.searchParams.set("pageSize", pageSize);
        const response = await fetch(url);
        console.log("response:", response.status);
        const data = await response.json();

    if(response.status === 200) {
        if(data.articles.length === 0) {
            throw new Error("검색 결과가 없습니다.");
        }
        newsList = data.articles;
        totalResult = data.totalResults;
        console.log("ddd", data);
        console.log("news", newsList);
        render();
        paginationRender();
    } else {
        throw new Error(data.message);
    }
} catch(error) {
        errorRender(error.message);
    }
}

const render = () => {
    const newsHTML = newsList
    .map(
      (news) => `<div class="row news">    
            <div class="col-lg-4">
                <img class="news-img-size" src=${
                  news.urlToImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }>
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>
                    ${news.description || "내용 없음"}
                </p> <br>
                <div>
                    ${news.source.name || "no source"} * ${moment(news.publishedAt).fromNow()}
                </div>
            </div>
        </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
}

searchButton.addEventListener("click", function () {
    searchInput.value = ""
  });

const paginationRender = () => {
const pageGroup = Math.ceil(page / GroupSize);
const totalPages = Math.ceil(totalResult/pageSize);
const lastPage = pageGroup * GroupSize;
console.log(lastPage);

if(lastPage > totalPages) {
    lastPage = totalPages;
}

const firstPage = lastPage - (GroupSize - 1) <= 0 ? 1 : lastPage - (GroupSize - 1);
let paginationHTML =``;
console.log(lastPage,firstPage);

paginationHTML+=`<li class="page-item" onclick="prevPage(${firstPage})"><a class="page-link" href="#"><</a></li>`;
for(let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
        i === page ? active : ""
    }" onclick="moveToPage"><a class="page-link">${i}</a></li>`
}
paginationHTML += `<li class="page-item" onclick="nextPage(${lastPage})"><a class="page-link" href="#">></a></li>`;

document.querySelector(".pagination").innerHTML = paginationHTML;
}
const moveToPage = (pageNum) => {
    console.log("movetopage", pageNum);
    page = pageNum;
    getNews();
}

const prevPage = (firstPage) => {
    if(page > firstPage){
      page -= 1;
      getNews();
    }
  }

  const nextPage = (lastPage) => {
    if(page < lastPage){
      page += 1;
      getNews();
    }
  }

getLatestNews();