import React,{useMemo, useState, useRef} from 'react';
import { styled, alpha, Box } from '@mui/system';
import Slider, { sliderClasses } from '@mui/base/Slider';
import style from './style.module.scss'
import formatCurrency from '../../helpers/formatCurrency';

import autoAnimate from '@formkit/auto-animate'

const blue = {
  100: '#eef4e1',
  200: '#b0dc4b',
  400: '#77A900',
  300: '#77A900',
  500: '#77A900',
  600: '#77A900',
  900: '#77A900',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledSlider = styled(Slider)(
  ({ theme }) => `
  color: ${theme.palette.mode === 'light' ? blue[500] : blue[300]};
  height: 6px;
  width: 100%;
  padding: 16px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    opacity: 1;
  }

  &.${sliderClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: ${theme.palette.mode === 'light' ? grey[300] : grey[600]};
    opacity: 0.5;
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
  height: 6px;
    border-radius: 2px;
    background-color: currentColor;
    opacity: 0.4;
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
  height: 6px;
    
    border-radius: 2px;
    background-color: currentColor;
  }

  & .${sliderClasses.thumb} {
    position: absolute;
    width: 16px;
    height: 16px;
    margin-left: -6px;
    margin-top: -6px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 3px solid currentColor;
    background-color: #fff;

    :hover,
    &.${sliderClasses.focusVisible} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? blue[400] : blue[300],
        0.15,
      )};
    }

    &.${sliderClasses.active} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.3,
      )};
    }
  }

  & .${sliderClasses.mark} {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
    top: 50%;
    opacity: 0.7;
    transform: translateX(-50%);
  }

  & .${sliderClasses.markActive} {
    background-color: #fff;
  }
`,
);


export default function ListFilters({rangeValues, setFilters, location, hideFilter}) {
  const [tempFilters, setTempFilters] = useState({
    location: location,
    rangeValues: rangeValues,
  })


  const handleChangeFilters = (event, newValue) => {
      setTempFilters(prev => {
          if(event.target.name === 'location'){
              return {...prev, location: event.target.value}
          }
          return {...prev, rangeValues: newValue}
      });
  }
    const handleApplyFilters = () => {
      setFilters(tempFilters);
      hideFilter()
    }

  return (
    <Box className={style.listFiltersContainer}>
      <h4 className={style.rangeHeader}>Preço</h4>
      <StyledSlider
        name="rangeValues"
        value={tempFilters.rangeValues}
        onChange={handleChangeFilters}
        getAriaLabel={() => 'Temperature range'}
        min={10000}
        max={1000000}
      />

      <div className={style.priceInputs}>
        <span>{formatCurrency(tempFilters.rangeValues[0])}</span>
        <>-</>
        <span>{formatCurrency(tempFilters.rangeValues[1])}</span>
      </div>
      <h4 className={style.rangeSubHeader}>Localização</h4>
      <input type="text" name='location' className={style.locationInput} placeholder='Digite uma rua, bairro ou cidade' value={tempFilters.location} onChange={handleChangeFilters} />
      <button className={style.filterButton} onClick={handleApplyFilters}>Aplicar</button>

    </Box>
  );
}
