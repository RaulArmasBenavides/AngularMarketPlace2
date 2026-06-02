import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';

import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent implements OnInit {
  path: string = Path.url;
  categories: any[] = [];
  render: boolean = true;
  categoriesList: any[] = [];
  categorySubcategories: { [key: string]: any[] } = {};

  constructor(
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService
  ) {}

  ngOnInit(): void {
    /*=============================================
		Tomamos la data de las categorías
		=============================================*/

    this.categoriesService.getData().subscribe((resp:any) => {
      let i;

      for (i in resp) {
        this.categories.push(resp[i]);

        /*=============================================
				Separamos los nombres de categorías
				=============================================*/

        this.categoriesList.push(resp[i].name);
      }
    });
  }

  /*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

  callback() {
    if (this.render) {
      this.render = false;

      this.categoriesList.forEach((category) => {
        this.subCategoriesService.getFilterData('category', category).subscribe((resp: any) => {
          this.categorySubcategories[category] = [];

          for (const i in resp) {
            this.categorySubcategories[category].push({
              subcategory: resp[i].name,
              url: resp[i].url
            });
          }
        });
      });
    }
  }
}
