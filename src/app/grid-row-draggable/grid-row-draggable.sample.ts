import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { IgxGridComponent } from 'igniteui-angular';
import { RemoteService } from '../shared/remote.service';

enum DragIcon {
    DEFAULT = 'drag_indicator',
    BLOCK = 'block',
    ALLOW = 'add'
}

@Component({
    selector: 'app-grid-row-draggable-sample',
    templateUrl: 'grid-row-draggable.sample.html',
    styleUrls: ['grid-row-draggable.sample.css']
})
export class GridRowDraggableComponent implements AfterViewInit {

    @ViewChild("grid1", { read: IgxGridComponent }) public grid1: IgxGridComponent;
    @ViewChild("grid2", { read: IgxGridComponent }) public grid2: IgxGridComponent;
    remote: Observable<any[]>;
    newData = [];
    dragdrop = true;
    public density = 'comfortable';
    public displayDensities;

    constructor(private remoteService: RemoteService, private cdr: ChangeDetectorRef) {
        this.remoteService.urlBuilder = (state) => this.remoteService.url;

        this.displayDensities = [
            { label: 'compact', selected: this.density === 'compact', togglable: true },
            { label: 'cosy', selected: this.density === 'cosy', togglable: true },
            { label: 'comfortable', selected: this.density === 'comfortable', togglable: true }
        ];
    }

    ngAfterViewInit() {
        this.remote = this.remoteService.remoteData;
        this.remoteService.getData(this.grid1.data);
        this.cdr.detectChanges();
    }

    public selectDensity(event) {
        this.density = this.displayDensities[event.index].label;
    }

    public handleRowDrag(args) {

    }

    public handleRowDrop(args) {

    }

    public onDropAllowed(args) {
        args.cancel = true;
        this.grid2.addRow(args.dragData.rowData);
        this.grid1.deleteRow(args.dragData.rowID);
    }

    public onEnterAllowed(args) {
        this.changeGhostIcon(args.drag.dragGhost, DragIcon.ALLOW);
    }

    public onLeaveAllowed(args) {
        this.changeGhostIcon(args.drag.dragGhost, DragIcon.DEFAULT);
    }

    public onEnterBlocked(args) {
        this.changeGhostIcon(args.drag.dragGhost, DragIcon.BLOCK);
    }

    public onLeaveBlocked(args) {
        this.changeGhostIcon(args.drag.dragGhost, DragIcon.DEFAULT);
    }

    public onDropBlocked(args) {
        args.cancel = true;
    }

    private changeGhostIcon(ghost, icon: string) {
        if (ghost) {
            ghost.querySelector('igx-icon').innerHTML = icon;
        }
    }
}
