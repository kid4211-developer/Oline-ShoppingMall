import React from 'react';
import { InfoWindow, withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Geocode from 'react-geocode';
import { Descriptions } from 'antd';
import AutoComplete from 'react-google-autocomplete';
import './css/GoogleMapPage.css';

Geocode.setApiKey('AIzaSyBi-UDxLBxLJMhmRNTqnUTuuCGWnSKo0JI');

class GoogleMapPage extends React.Component {
    state = {
        address: '',
        city: '',
        area: '',
        state: '',
        zoom: '',
        height: 400,
        mapPosition: {
            lat: 0,
            lng: 0,
        },
        markerPosition: {
            lat: 0,
            lng: 0,
        },
    };

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState(
                    {
                        mapPosition: {
                            lat: 35.159763,
                            lng: 128.106261,
                        },
                        markerPosition: {
                            lat: 35.159763,
                            lng: 128.106261,
                        },
                    },
                    () => {
                        Geocode.fromLatLng(35.159763, 128.106261).then((response) => {
                            const address = response.results[0].formatted_address,
                                addressArray = response.results[0].address_components,
                                city = this.getCity(addressArray),
                                area = this.getArea(addressArray),
                                state = this.getState(addressArray);

                            this.setState({
                                address: address ? address : '',
                                city: city ? city : '',
                                area: area ? area : '',
                                state: state ? state : '',
                            });
                        });
                    }
                );
            });
        } else {
        }
    }

    getCity = (addressArray) => {
        let city = '';
        for (let index = 0; index < addressArray.length; index++) {
            if (
                addressArray[index].types[0] &&
                'administrative_area_level_2' === addressArray[index].types[0]
            ) {
                city = addressArray[index].long_name;
                console.log('city :', city);
                return city;
            }
        }
    };

    getArea = (addressArray) => {
        let area = '';
        for (let index = 0; index < addressArray.length; index++) {
            if (addressArray[index].types[0]) {
                for (let j = 0; j < addressArray.length; j++) {
                    if (
                        'sublocality_level_1' === addressArray[index].types[j] ||
                        'locality' === addressArray[index].types[j]
                    ) {
                        area = addressArray[index].long_name;
                        console.log('area :', area);
                        return area;
                    }
                }
            }
        }
    };

    getState = (addressArray) => {
        let state = '';
        for (let index = 0; index < addressArray.length; index++) {
            for (let index = 0; index < addressArray.length; index++) {
                if (
                    addressArray[index].types[0] &&
                    'administrative_area_level_1' === addressArray[index].types[0]
                ) {
                    state = addressArray[index].long_name;
                    console.log('state :', state);
                    return state;
                }
            }
        }
    };

    onMarkerDragEnd = (e) => {
        let newLat = e.latLng.lat();
        let newLng = e.latLng.lng();
        Geocode.fromLatLng(newLat, newLng).then((response) => {
            const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray);

            this.setState({
                address: address ? address : '',
                city: city ? city : '',
                area: area ? area : '',
                state: state ? state : '',
                mapPosition: {
                    lat: newLat,
                    lng: newLng,
                },
                markerPosition: {
                    lat: newLat,
                    lng: newLng,
                },
            });
        });
    };

    onPlaceSelected = (place) => {
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            newLat = place.geometry.location.lat(),
            newLng = place.geometry.location.lng();
        this.setState({
            address: address ? address : '',
            city: city ? city : '',
            area: area ? area : '',
            state: state ? state : '',
            mapPosition: {
                lat: newLat,
                lng: newLng,
            },
            markerPosition: {
                lat: newLat,
                lng: newLng,
            },
        });
    };

    render() {
        const MapWithAMarker = withScriptjs(
            withGoogleMap((props) => (
                <GoogleMap
                    defaultZoom={16}
                    defaultCenter={{
                        lat: this.state.mapPosition.lat,
                        lng: this.state.mapPosition.lng,
                    }}
                >
                    <Marker
                        draggable={true}
                        onDragEnd={this.onMarkerDragEnd}
                        position={{
                            lat: this.state.markerPosition.lat,
                            lng: this.state.markerPosition.lng,
                        }}
                    >
                        <InfoWindow>
                            <div>{this.state.address}</div>
                        </InfoWindow>
                    </Marker>
                    <AutoComplete
                        style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: 16,
                            marginTop: 2,
                            marginBottom: '2rem',
                            border: '1px solid #e5e5e5',
                            borderRadius: '5px',
                        }}
                        placeholder="Enter a location"
                        types={['(regions)']}
                        onPlaceSelected={this.onPlaceSelected}
                    />
                </GoogleMap>
            ))
        );
        return (
            <div className="Mapdiv">
                <h1>Where is Seoul IT ?</h1>
                <Descriptions
                    bordered
                    style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', marginTop: '2rem' }}
                >
                    <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
                    <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
                    <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
                    <Descriptions.Item label="Address">{this.state.address}</Descriptions.Item>
                </Descriptions>
                <MapWithAMarker
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBi-UDxLBxLJMhmRNTqnUTuuCGWnSKo0JI&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                        <div
                            style={{ height: `400px`, boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}
                        />
                    }
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        );
    }
}

export default GoogleMapPage;
