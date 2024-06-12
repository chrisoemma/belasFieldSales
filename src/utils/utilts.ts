import { Linking } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from './config';
import moment from 'moment'; 
import { colors } from './colors';

export const currencyFormatter: any = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'TZS',
});

export const stripHtml = (html: any) => {
  return html.replace(/<[^>]*>?/gm, '');
};

export const truncate = (input: any, length: number) => {
  if (input.length > length) {
    return input.substring(0, length) + '...';
  }
  return input;
};

export const getAverageRating = (ratings: any) => {
  const average =
    ratings.reduce((total: any, next: any) => total + next.rating, 0) /
    ratings.length;

  return average ? average : 0;
};


export const makePhoneCall = phoneNumber => {
  Linking.openURL(`tel:${phoneNumber}`)
    .catch(error => {
      console.error('Error making phone call: ', error);
    });
};

export const formatNumber = (number, decPlaces, decSep, thouSep) => {
  (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
    (decSep = typeof decSep === 'undefined' ? '.' : decSep);
  thouSep = typeof thouSep === 'undefined' ? ',' : thouSep;
  var sign = number < 0 ? '-' : '';
  var i = String(
    parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces))),
  );
  var j = (j = i.length) > 3 ? j % 3 : 0;

  return (
    sign +
    (j ? i.substr(0, j) + thouSep : '') +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, '$1' + thouSep) +
    (decPlaces
      ? decSep +
      Math.abs(number - i)
        .toFixed(decPlaces)
        .slice(2)
      : '')
  );
};



export const formatCheckinTime = (originalCheckinTime) => {
  const checkinMoment = moment(originalCheckinTime);
  const formattedCheckinTime = checkinMoment.format("DD-MMM-YYYY h:mma");

  return formattedCheckinTime;
}

export const formatDate = (d) => {
 const date = new Date(d);
 const year = date.getFullYear();
 const month = date.getMonth() + 1;
  const dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return dt +"/" + month + "/" + year;
};

export const formatDateToYYYYMMDD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export const dbDateFormat = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return year + "-" + month + "-" + dt;
};


export const getStatusColor = (level, status, isLastStage) => {
  if (isLastStage) {
      if (status === 'Won') return colors.successGreen;
      if (status === 'Lost') return colors.dangerRed;
  }

  // Assign colors based on the level if not the last stage
  switch (level) {
      case 1: // Qualify
          return colors.darkGrey;
      case 2: // Meet & Present
          return colors.warningYellow;
      case 3: // Propose
          return colors.warningYellow;
      case 4: // Negotiate
          return colors.lightBlue;
      // Add more cases as needed for additional levels
      default:
          return colors.darkGrey;
  }
};

export const transformDataToDropdownOptionsClients=(data:any)=> {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(item => ({
    label: `${item.name} (${item.phone_number})`,
    value: item.id.toString(),
  }));
}


export const getdate = (date: any) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // Add leading zero to day if it's less than 10
  let dayString = (day < 10) ? `0${day}` : `${day}`;
  2
  // Add leading zero to month if it's less than 10
  let monthString = (month < 10) ? `0${month}` : `${month}`;

  return `${dayString}/${monthString}/${year}`;
}


export const getTime = (date: any) => {

  return date.toLocaleTimeString('en-US')
}

export function extractIdAndName(usersData) {
  const result = [];

  usersData.forEach((item) => {
    const userId = item.user.id;
    const userName = item.user.name;

    result.push({
      value: userId,
      label: userName,
    });
  });

  return result;
}


export const pickerDuration = (n)=>{
  let start = new Date();
  let dd = String(start.getDate()).padStart(2, '0');
  let mm = String(start.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = start.getFullYear();
  const formated_start =yyyy+ '-'+ mm + '-' + dd;

 let end =start.setDate(start.getDate() + n);
  end=new Date(end)
 let td=String(end.getDate()).padStart(2, '0');
  let tm=String(end.getMonth() + 1).padStart(2, '0');
  let tyy=end.getFullYear();
  let formated_end=tyy+'-'+tm+'-'+td

 return {formated_start,formated_end};

}


export const formatDateToYYYYMMDDHHMM = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  const hours = (`0${d.getHours()}`).slice(-2);
  const minutes = (`0${d.getMinutes()}`).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};


export const transformDataToDropdownOptions=(data:any)=> {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
}


export const transformDataToDropdownOptionsLead=(data:any)=> {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(item => ({
    label: item.name,
    value: item.name,
  }));
}



export const getLocationName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.results.length > 0) {
      const addressComponents = data.results[0].address_components;

      // Extract relevant parts of the address (e.g., locality and country)
      const locationNameParts = addressComponents
        .filter((component) =>
          ['locality', 'administrative_area_level_1', 'country'].includes(
            component.types[0]
          )
        )
        .map((component) => component.long_name)
        .join(', ');

      return locationNameParts;
    } else {
      return 'Location not found';
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return 'Error fetching location data';
  }
};

export function breakTextIntoLines(text, maxLength) {
  if (text.length <= maxLength) {
    return text; // No need to break into lines if it's within the maxLength
  }

  const chunks = [];
  while (text.length > 0) {
    chunks.push(text.substring(0, maxLength));
    text = text.substring(maxLength);
  }

  return chunks.join('\n');
}
