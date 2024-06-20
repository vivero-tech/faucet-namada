import { ColorMode, DesignConfiguration } from "@namada/utils";
import styled, { createGlobalStyle } from "styled-components";

type GlobalStyleProps = {
  colorMode: ColorMode;
};

enum ComponentColor {
  BorderColor,
  BackgroundColor,
}

const getColor = (
  color: ComponentColor,
  theme: DesignConfiguration
): string => {
  const { colorMode } = theme.themeConfigurations;

  const colorMap: Record<ColorMode, Record<ComponentColor, string>> = {
    light: {
      [ComponentColor.BorderColor]: theme.colors.utility2.main20,
      [ComponentColor.BackgroundColor]: theme.colors.utility1.main,
    },
    dark: {
      [ComponentColor.BorderColor]: "transparent",
      [ComponentColor.BackgroundColor]: theme.colors.utility3.black,
    },
  };

  return colorMap[colorMode][color];
};

export const AppContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  transition: all 0.3s linear;
  box-sizing: border-box;

  @media screen and (max-width: 860px) {
    padding: 0 32px;
    min-width: 480px;
  }
`;

export const TopSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 24px;
`;

export const BottomSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export const FaucetContainer = styled.div`
  flex-direction: column;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  background-color: ${(props) =>
    getColor(ComponentColor.BackgroundColor, props.theme)};
  border: 1px solid
    ${(props) => getColor(ComponentColor.BorderColor, props.theme)};

  border-radius: ${(props) => props.theme.borderRadius.mainContainer};
  transition: background-color 0.3s linear;
`;

export const Banner = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.utility3.highAttention};
  color: ${(props) => props.theme.colors.primary.main20};
  font-size: 13px;
  font-weight: bold;
`;

export const BannerContents = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  max-width: 762px;
  padding: 8px 0;
  margin: 0 20px;
`;

export const BackgroundImage = styled.div<{
  imageUrl: string;
}>`
  position: absolute;
  width: 100%;
  height: 425px;
  top: 0;
  left: 0;
  z-index: 0;
  background-image: url(${(props) => props.imageUrl});
  background-size: 120px;
`;

export const InfoContainer = styled.div`
  margin: 40px 20px;
  display: none;
`;
