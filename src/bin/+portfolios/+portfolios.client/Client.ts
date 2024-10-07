import {Component, OnInit, Input} from '@angular/core';

import {Socket, Models} from 'lib/K';

@Component({
  selector: 'client',
  template: `<div class="row">
      <div class="col-md-12 col-xs-12">
          <div class="col-md-6">
            <settings
              [product]="product"
              [settings]="settings"></settings>
            <wallets
              [wallets]="wallets"
              [markets]="markets"
              [settings]="settings"></wallets>
          </div>
          <div class="col-md-6">
            <orders
             [orders]="orders"></orders>
          </div>
      </div>
  </div>`
})
export class ClientComponent implements OnInit {

  private wallets: any = null;

  private markets: any = null;

  private orders: Models.Order[] = [];

  private settings: Models.PortfolioParameters = new Models.PortfolioParameters();

  @Input() addr: string;

  @Input() tradeFreq: number;

  @Input() state: Models.ExchangeState;

  @Input() product: Models.ProductAdvertisement;

  ngOnInit() {
    new Socket.Subscriber(Models.Topics.QuotingParametersChange)
      .registerSubscriber((o: Models.PortfolioParameters) => { this.settings = o; });

    new Socket.Subscriber(Models.Topics.MarketData)
      .registerSubscriber((o: any) => { this.markets = o; })
      .registerDisconnectedHandler(() => { this.markets = null; });

    new Socket.Subscriber(Models.Topics.Position)
      .registerSubscriber((o: any[]) => { this.wallets = o; })
      .registerDisconnectedHandler(() => { this.wallets = null; });

    new Socket.Subscriber(Models.Topics.OrderStatusReports)
      .registerSubscriber((o: Models.Order[]) => { this.orders = o; })
      .registerDisconnectedHandler(() => { this.orders = []; });
  };
};
