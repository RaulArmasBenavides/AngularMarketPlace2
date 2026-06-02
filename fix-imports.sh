#!/bin/bash

# Remover funciones eliminadas de imports
for file in $(find src/app/pages -name "*.ts" -type f); do
  # Rating
  sed -i 's/import { Rating,/import {/g; s/, Rating//' "$file"
  sed -i 's/Rating,//g' "$file"

  # Datepicker
  sed -i 's/Datepicker,//g' "$file"
  sed -i 's/, Datepicker//g' "$file"

  # OwlCarouselConfig
  sed -i 's/OwlCarouselConfig,//g; s/, OwlCarouselConfig//g' "$file"

  # SlickConfig
  sed -i 's/SlickConfig,//g; s/, SlickConfig//g' "$file"

  # ProductLightbox
  sed -i 's/ProductLightbox,//g; s/, ProductLightbox//g' "$file"

  # Tabs
  sed -i 's/Tabs,//g; s/, Tabs//g' "$file"

  # Quantity
  sed -i 's/Quantity,//g; s/, Quantity//g' "$file"

  # Pagination
  sed -i 's/Pagination,//g; s/, Pagination//g' "$file"

  # Select2Cofig (typo en functions.ts)
  sed -i 's/Select2Cofig,//g; s/, Select2Cofig//g' "$file"
done

echo "Imports cleaned"
