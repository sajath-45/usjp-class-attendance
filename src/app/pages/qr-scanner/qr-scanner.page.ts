import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {
  contentVisibility = 'show';
  constructor(public modalCtrl: ModalController) {
    this.startScan();
  }

  ngOnInit() {}

  async startScan() {
    try {
      await BarcodeScanner.checkPermission({ force: true });
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.contentVisibility = 'hidden';
      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
      console.log(result);
      this.contentVisibility = 'show';

      // if the result has content
      if (result.hasContent) {
        console.log(result.content); // log the raw scanned content
        this.modalCtrl.dismiss(result.content);
      } else {
        this.modalCtrl.dismiss();
      }
    } catch (e) {
      console.log(e);
      this.stop();
    }
  }
  stop() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }

  ngOnDestroy() {
    this.stop();
  }
}
