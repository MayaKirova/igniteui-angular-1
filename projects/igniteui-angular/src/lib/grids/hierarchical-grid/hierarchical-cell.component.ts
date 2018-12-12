import { IgxGridCellComponent, GridBaseAPIService } from '../grid';
import { IgxHierarchicalGridAPIService } from './hierarchical-grid-api.service';
import { ChangeDetectorRef, ElementRef, ChangeDetectionStrategy, Component, OnInit, AfterViewInit, forwardRef } from '@angular/core';
import { IgxHierarchicalGridComponent } from './hierarchical-grid.component';
import { IgxHierarchicalSelectionAPIService } from './selection';
import { IgxSelectionAPIService } from '../../core/selection';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    preserveWhitespaces: false,
    selector: 'igx-hierarchical-grid-cell',
    templateUrl: './../cell.component.html'
})
export class IgxHirarchicalGridCellComponent extends IgxGridCellComponent implements OnInit {
    protected hSelection;
    protected _rootGrid;
    constructor(
        public gridAPI: GridBaseAPIService<IgxHierarchicalGridComponent>,
        public selection: IgxHierarchicalSelectionAPIService,
        public cdr: ChangeDetectorRef,
        private helement: ElementRef) {
            super(gridAPI, selection, cdr, helement);
            this.hSelection = <IgxHierarchicalSelectionAPIService>selection;
         }

    ngOnInit() {
        super.ngOnInit();
        this._rootGrid = this._getRootGrid();
    }
    private _getRootGrid() {
        let currGrid = this.grid;
        while (currGrid.parent) {
            currGrid = currGrid.parent;
        }
        return currGrid;
    }
    protected _saveCellSelection(newSelection?: Set<any>) {
        super._saveCellSelection(newSelection);
        if (!newSelection) {
            this.hSelection.add_sub_item(this._rootGrid.id, this.grid.id, this);
        }
    }

    public isCellSelected() {
        const selection = this.hSelection.get_sub_item(this._rootGrid.id);
        const isSelected = selection ? selection.gridID === this.grid.id : false;
        return  super.isCellSelected() && isSelected;
    }

    protected _clearCellSelection() {
        super._clearCellSelection();
        const sel = this.hSelection.get_sub_item(this._rootGrid.id);
        if (sel) {
            this.hSelection.clear_sub_item(this._rootGrid.id);
            sel.cell.cdr.markForCheck();
        }
    }
}