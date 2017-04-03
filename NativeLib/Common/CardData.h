#ifndef CardData_hpp
#define CardData_hpp

#include "cocos2d.h"

USING_NS_CC;
using namespace std;

class  CardData
{
    
public:
    static CardData* getInstance();
    void copyCardData();
    void clearCache();
};

#endif /* CardData_hpp */
