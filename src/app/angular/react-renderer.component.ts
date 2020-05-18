import { Component, OnInit } from '@angular/core';
import { ReactApplication } from '../react/react-application';

@Component({
    selector: 'app-react-renderer',
    styleUrls: ['./zozo.scss'],
    template: `<div class="cai-webchat-div" id="cai-webchat-div"></div>`
})
export class ReactRendererComponent implements OnInit {
    constructor() { }

    ngOnInit() {
        ReactApplication.initialize(document.getElementById('cai-webchat-div'));
    }   
}