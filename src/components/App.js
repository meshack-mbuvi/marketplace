import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Marketplace from '../abis/Marketplace.json'
import Navbar from './navbar'
import Main from './Main'
import Loader from './Loader'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
  }

  async loadWeb3() {
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);

      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }

    });
  }

  async loadBlockChainData() {
    const ethereum = window.ethereum;
    const web3 = new Web3(ethereum);
    await ethereum.enable();
    const [account] = await web3.eth.getAccounts();
    this.setState({ account })

    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]

    if (networkData) {
      const marketplace = new web3.eth.Contract(
        Marketplace.abi, networkData.address
      )
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()

      for (let i = 1; i <= parseInt(productCount); i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({ products: [...this.state.products, product] })
      }


      this.setState({ loading: false })
      console.log(this.state)
    } else {
      window.alert('Marketplace contract not deployed to newtork')
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async createProduct(name, price) {
    this.setState({ loading: true })
    await this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account }).once('receipt', async (receipt) => {
      const productCount = this.state.productCount + 1
      this.setState({ loading: false, productCount })
      const product = await this.state.marketplace.methods.products(productCount).call()
      this.setState({ products: [...this.state.products, product] })
    })

    let productCount = this.state.productCount + 1
    this.setState({ loading: false, productCount })
    const product = await this.state.marketplace.methods.products(productCount).call()
    this.setState({ products: [...this.state.products, product] })
    this.setState({ loading: false, productCount })


  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? <Loader /> : <Main products={this.state.products} createProduct={this.createProduct} />}

            </main>

          </div>
        </div>


      </div>
    );
  }
}

export default App;
