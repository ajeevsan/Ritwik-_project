import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http:HttpClient) {}

  search(query)
  {
    //return this.http.post("http://127.0.0.1:8000/query",{"query": query});
    return this.http.post("http://127.0.0.1:8000/query",{"query": query});
  }

  searchDateTime(query)
  {
    //return this.http.post("http://127.0.0.1:8000/searchDateTime",{"query": query});
    return this.http.post("http://127.0.0.1:8000/searchDateTime",{"query": query});
  }

  getImg(img)
  {
    console.log(img)
    return this.http.post("http://127.0.0.1:8000/showImg", {'imgPath': img})
  }
}
