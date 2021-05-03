import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchGifsResponse, Gif } from '../interfaces/gifs.interfaces';



@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey     : string = 'WCFkGrIYi7VJg5Ui7iaAUh4cThkGBtpP';
  private _historial : string[] = [];
  
  public resultados: Gif[] = [];

  get historial(){
    // El operador spread se utilizar en este caso para que evitar que se cambien los valores almacenados en el arreglo privado
    // "_historial", es decir, utilizandolo se puede agregar, modificar o eliminar los valores y conservar los otros tal cual se
    // se ingresaron. 
    return [ ...this._historial ];
  }

  constructor( private http: HttpClient ) { 

    // Para almacenar la informacion en el localstorage se puede hacer de esta forma:
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse( localStorage.getItem('resultados')! ) || []

    // Ó de esta forma:

    // if( localStorage.getItem('historial') ) {
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }

  }

  buscarGifs( query: string ) {

    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes( query ) ) {

      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify( this._historial ));

    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query)

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe(( resp ) => {
        this.resultados = resp.data
        // console.log( resp.data );
        localStorage.setItem('resultados', JSON.stringify( this.resultados ));
      })

  }

}
