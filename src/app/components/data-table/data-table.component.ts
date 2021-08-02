import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { AppService } from '../../service/app.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { EditItemPopupComponent } from '../edit-item-popup/edit-item-popup.component';
import { DataTableDataSource, DataTableItem } from './data-table-datasource';



@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataTableItem>;
  dataSource: DataTableDataSource;
  listOfItem: any[] = [];


  /* Columns displayed in the table */
  displayedColumns = ['id', 'item_name', 'item_desc', 'original_price', 'discount', 'discounted_amount', 'isAvailable', 'action'];
  /* Data display name and type */
  headerName: any = {
    id: {
      name:'ID',
      type: 'link'
    },
    item_name: {
      name:'Item Name',
      type: 'text'
    },
    item_desc: {
      name:'Description',
      type: 'text'
    },
    original_price: {
      name:'Original Price',
      type: 'text'
    },
    discount:  {
      name:'Discount %',
      type: 'percentage'
    },
    discounted_amount:  {
      name:'Discounted Amount',
      type: 'calculation'
    },
    isAvailable: {
      name:'Availability',
      type: 'boolean'
    },
    action: {
      name:'Actions',
      type: 'actions'
    }
  }
  exampleData: DataTableItem[] = [];
  constructor(private appService: AppService, private dialog: MatDialog, private snackbar: SnackBarService) {
    this.dataSource = new DataTableDataSource([]);
  }

  ngOnInit() {
    this.refreshData();
  }

  /**
  * Fetch the List of item from API and refresh the data in the table.
  **/
  refreshData() {
    this.appService.getAllItemList().subscribe(item => {
      this.listOfItem = item;
      this.dataSource = new DataTableDataSource(item);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      this.dataSource.connect()
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  /**
  * Based on the original price and discount discounted amount will be calculated.
  **/
  getDiscountedValue(row: DataTableItem) {
    if(row.discount && row.discount > 0) {
      return (Number(row.original_price) * (100 - Number(row.discount)))/100
    } else {
      return row.original_price
    }
  }

  /**
  * On click of Edit icon in the row edit popup will be shown.
  * Based on the user input, if the saved data and entered data are same
  * then no API's are called
  **/
  editItem(row: DataTableItem) {
    this.openEditDialog(row, row.id)
  }

  /**
  * On click of Delete icon in the row confirmation popup is shown.
  * Based on the user choice item will be retained or deleted from the list 
  **/
  deleteItem(row: DataTableItem) {
    this.openConfirmationDialog(row);
  }

  /**
  * On click of Add New Item button edit popup is shown.
  * where user can enter the data
  * Here item.id is calculated 
  **/
  addNewItem() {
    let itemList = this.listOfItem.map(i => Number(i.id));
    let newId: any;
    if(itemList.length == 0) {
      newId = 1
    } else {
      newId = Math.max(...itemList)+1
    }
    this.openEditDialog(null,newId, true);
  }

  // Open edit dialog
  openEditDialog(row: any, itemId:number, isNewData?: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(EditItemPopupComponent, dialogConfig);
    dialogRef.componentInstance.rowData = row;
    dialogRef.componentInstance.isNewRow = !!isNewData ? true : false;
    dialogRef.componentInstance.headerName = !!isNewData ? 'Add Item Details' : 'Edit Item Details';
    dialogRef.componentInstance.updatedId = itemId;
    dialogRef.afterClosed().subscribe(result => {
      if(!!result) {
        let updateResult = dialogRef.componentInstance.saveData;
        let updatedId = dialogRef.componentInstance.updatedId;
        if(!!isNewData) {
          this.appService.addItem(updateResult).subscribe(result => {
            this.snackbar.success('Item added successfully');
            this.refreshData();
          }, error => {
            this.snackbar.error('Some error occured!');
          })
        } else {
          this.appService.updateItem(updatedId,updateResult).subscribe(result => {
            this.snackbar.success('Data updated successfully');
            this.refreshData();
          }, error => {
            this.snackbar.error('Some error occured!');
          })
        }
      }
    });
}

// Open confirmation popup
openConfirmationDialog(row: DataTableItem) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  const dialogRef = this.dialog.open(ConfirmationPopupComponent, dialogConfig);
  dialogRef.componentInstance.heading = 'Delete Item';
  dialogRef.componentInstance.content = `Are you sure? You want to delete ${row.id}-${row.item_name}?`
  dialogRef.afterClosed().subscribe(result => {
    if(!!result) {
      this.appService.deleteItem(row.id).subscribe(result => {
        this.snackbar.success('Item deleted successfully');
        this.refreshData();
      }, error => {
        this.snackbar.error('Some error occured!');
      })
    }
  });
}
}
